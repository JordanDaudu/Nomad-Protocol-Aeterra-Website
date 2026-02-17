// AudioManager.ts
import {
  AUDIO_TRACKS,
  getTrackForRoute,
  getTrackIdForRoute,
  type AudioTrack,
} from "./audioTracks";

const MUTE_STORAGE_KEY = "nomad-protocol-audio-muted";
const FADE_DURATION = 1500;

interface AudioChannel {
  audio: HTMLAudioElement;
  source: MediaElementAudioSourceNode | null;
  gainNode: GainNode | null;
}

class AudioManager {
  private audioContext: AudioContext | null = null;
  private channelA: AudioChannel | null = null;
  private channelB: AudioChannel | null = null;
  private activeChannel: "A" | "B" = "A";
  private currentTrackId: string = "default";
  private isMuted: boolean = false;
  private autoplayBlocked: boolean = false;
  private isInitialized: boolean = false;
  private isUnlocked: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  // Serialize all audio mutations to prevent race conditions between
  // crossfades, route changes, and mute toggles.
  private opQueue: Promise<void> = Promise.resolve();

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(MUTE_STORAGE_KEY);
      this.isMuted = stored === "true";
    }
  }

  private enqueue<T>(fn: () => Promise<T>): Promise<T> {
    const next = this.opQueue.then(fn, fn);
    this.opQueue = next.then(
        () => undefined,
        () => undefined
    );
    return next;
  }

  private getActiveChannel(): AudioChannel | null {
    return this.activeChannel === "A" ? this.channelA : this.channelB;
  }

  private getInactiveChannel(): AudioChannel | null {
    return this.activeChannel === "A" ? this.channelB : this.channelA;
  }

  private createAudioContext(): AudioContext {
    const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
    return new AudioContextClass();
  }

  private createChannel(track: AudioTrack): AudioChannel {
    const audio = new Audio();
    audio.src = track.src;
    audio.loop = track.loop;
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.setAttribute("playsinline", "true");
    audio.setAttribute("webkit-playsinline", "true");

    return {
      audio,
      source: null,
      gainNode: null,
    };
  }

  private connectChannel(channel: AudioChannel): void {
    if (!this.audioContext || channel.source) return;

    try {
      channel.source = this.audioContext.createMediaElementSource(channel.audio);
      channel.gainNode = this.audioContext.createGain();
      channel.gainNode.gain.value = 0;

      channel.source.connect(channel.gainNode);
      channel.gainNode.connect(this.audioContext.destination);
    } catch (e) {
      console.error("Failed to connect audio channel:", e);
    }
  }

  private async unlockAudio(): Promise<void> {
    if (this.isUnlocked || !this.audioContext) return;

    try {
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      // iOS/Safari unlock: play a silent oscillator very briefly
      const oscillator = this.audioContext.createOscillator();
      const silentGain = this.audioContext.createGain();
      silentGain.gain.value = 0;
      oscillator.connect(silentGain);
      silentGain.connect(this.audioContext.destination);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.001);

      this.isUnlocked = true;
    } catch (e) {
      console.error("Failed to unlock audio:", e);
    }
  }

  async initialize(): Promise<void> {
    // Initialize is safe to call multiple times, but we only want it once.
    if (this.isInitialized) return;

    this.audioContext = this.createAudioContext();

    const defaultTrack = AUDIO_TRACKS.default;
    this.channelA = this.createChannel(defaultTrack);
    this.channelB = this.createChannel(defaultTrack);

    this.connectChannel(this.channelA);
    this.connectChannel(this.channelB);

    this.isInitialized = true;

    const handleUserInteraction = async () => {
      await this.unlockAudio();

      if (!this.isMuted && this.channelA) {
        try {
          await this.channelA.audio.play();
          if (this.channelA.gainNode && this.audioContext) {
            const track = AUDIO_TRACKS.default;
            this.channelA.gainNode.gain.setValueAtTime(
                track.volume,
                this.audioContext.currentTime
            );
          }
        } catch (e) {
          this.autoplayBlocked = true;
          this.notifyListeners();
        }
      }

      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });

    if (!this.isMuted) {
      try {
        await this.channelA.audio.play();
        if (this.channelA.gainNode && this.audioContext) {
          const track = AUDIO_TRACKS.default;
          this.channelA.gainNode.gain.setValueAtTime(
              track.volume,
              this.audioContext.currentTime
          );
        }
      } catch (e) {
        this.autoplayBlocked = true;
        this.notifyListeners();
      }
    }
  }

  async setContext(route: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const trackId = getTrackIdForRoute(route);
    if (trackId === this.currentTrackId) return;

    const track = getTrackForRoute(route);
    await this.crossfadeTo(track, trackId);
  }

  async setTrackById(trackId: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (trackId === this.currentTrackId) return;

    const track = AUDIO_TRACKS[trackId];
    if (!track) {
      console.warn(`Audio track "${trackId}" not found, using default`);
      return;
    }

    await this.crossfadeTo(track, trackId);
  }

  private cancelAndRamp(
      gainNode: GainNode,
      now: number,
      target: number,
      durationSec: number
  ): void {
    // Critical for "button desync" bugs: cancel old ramps before scheduling new ones.
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(target, now + durationSec);
  }

  private async crossfadeTo(track: AudioTrack, trackId: string): Promise<void> {
    return this.enqueue(async () => {
      const fadeOutChannel = this.getActiveChannel();
      const fadeInChannel = this.getInactiveChannel();

      if (!fadeOutChannel || !fadeInChannel || !this.audioContext) return;

      await this.unlockAudio();

      const targetVolume = this.isMuted ? 0 : track.volume;
      const halfDurationSec = FADE_DURATION / 2000;

      // Prepare and preload the new track
      fadeInChannel.audio.src = track.src;
      fadeInChannel.audio.loop = track.loop;
      fadeInChannel.audio.currentTime = 0;

      // Reset fade-in gain to 0
      if (fadeInChannel.gainNode) {
        fadeInChannel.gainNode.gain.value = 0;
      }

      // Wait for the new track to be ready (or timeout)
      await new Promise<void>((resolve) => {
        let resolved = false;

        const onCanPlay = () => {
          if (resolved) return;
          resolved = true;
          fadeInChannel.audio.removeEventListener("canplaythrough", onCanPlay);
          resolve();
        };

        fadeInChannel.audio.addEventListener("canplaythrough", onCanPlay);
        fadeInChannel.audio.load();

        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            fadeInChannel.audio.removeEventListener("canplaythrough", onCanPlay);
            resolve();
          }
        }, 1500);
      });

      // Phase 1: Fade out current track
      const fadeOutStartTime = this.audioContext.currentTime;

      if (fadeOutChannel.gainNode) {
        const g = fadeOutChannel.gainNode;
        g.gain.cancelScheduledValues(fadeOutStartTime);
        g.gain.setValueAtTime(g.gain.value, fadeOutStartTime);
        g.gain.linearRampToValueAtTime(
            0,
            fadeOutStartTime + halfDurationSec
        );
      }

      // Wait for fade out to complete (AudioContext time-based)
      await new Promise<void>((resolve) => {
        const checkTime = () => {
          if (
              this.audioContext &&
              this.audioContext.currentTime >= fadeOutStartTime + halfDurationSec
          ) {
            resolve();
          } else {
            requestAnimationFrame(checkTime);
          }
        };
        requestAnimationFrame(checkTime);
      });

      // Stop old track
      fadeOutChannel.audio.pause();
      fadeOutChannel.audio.currentTime = 0;

      // Phase 2: Start and fade in new track
      try {
        await fadeInChannel.audio.play();
      } catch (e) {
        console.error("Failed to play new track:", e);
        // Still advance internal state so route changes don't get stuck retrying
        this.activeChannel = this.activeChannel === "A" ? "B" : "A";
        this.currentTrackId = trackId;
        return;
      }

      const fadeInStartTime = this.audioContext.currentTime;

      if (fadeInChannel.gainNode) {
        const g = fadeInChannel.gainNode;
        g.gain.cancelScheduledValues(fadeInStartTime);
        g.gain.setValueAtTime(0, fadeInStartTime);
        g.gain.linearRampToValueAtTime(
            targetVolume,
            fadeInStartTime + halfDurationSec
        );
      }

      // Wait for fade in to complete
      await new Promise<void>((resolve) => {
        const checkTime = () => {
          if (
              this.audioContext &&
              this.audioContext.currentTime >= fadeInStartTime + halfDurationSec
          ) {
            resolve();
          } else {
            requestAnimationFrame(checkTime);
          }
        };
        requestAnimationFrame(checkTime);
      });

      this.activeChannel = this.activeChannel === "A" ? "B" : "A";
      this.currentTrackId = trackId;
    });
  }

  resetToDefault(): void {
    void this.setContext("/");
  }

  async toggleMute(): Promise<void> {
    return this.enqueue(async () => {
      this.isMuted = !this.isMuted;
      localStorage.setItem(MUTE_STORAGE_KEY, String(this.isMuted));

      if (!this.audioContext) {
        this.notifyListeners();
        return;
      }

      await this.unlockAudio();

      const activeChannel = this.getActiveChannel();
      const inactiveChannel = this.getInactiveChannel();
      const now = this.audioContext.currentTime;
      const fadeDurationSec = 0.3;

      if (this.isMuted) {
        // Fade BOTH channels down (in case one is mid-crossfade)
        if (activeChannel?.gainNode) {
          this.cancelAndRamp(activeChannel.gainNode, now, 0, fadeDurationSec);
        }
        if (inactiveChannel?.gainNode) {
          this.cancelAndRamp(inactiveChannel.gainNode, now, 0, fadeDurationSec);
        }
      } else {
        const track = AUDIO_TRACKS[this.currentTrackId] || AUDIO_TRACKS.default;

        if (activeChannel) {
          if (activeChannel.audio.paused) {
            try {
              await activeChannel.audio.play();
            } catch (e) {
              console.error("Failed to resume audio:", e);
            }
          }

          if (activeChannel.gainNode) {
            // Cancel any previous "fade to 0" schedules before ramping up.
            this.cancelAndRamp(
                activeChannel.gainNode,
                now,
                track.volume,
                fadeDurationSec
            );
          }
        }
      }

      this.notifyListeners();
    });
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  subscribe(listener: (muted: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.isMuted));
  }

  async tryAutoplay(): Promise<void> {
    // tryAutoplay might be called from UI; keep it serialized too.
    return this.enqueue(async () => {
      if (!this.isInitialized) {
        await this.initialize();
        return;
      }

      await this.unlockAudio();

      const activeChannel = this.getActiveChannel();
      if (activeChannel && activeChannel.audio.paused) {
        try {
          await activeChannel.audio.play();
          if (activeChannel.gainNode && this.audioContext && !this.isMuted) {
            const track =
                AUDIO_TRACKS[this.currentTrackId] || AUDIO_TRACKS.default;
            const now = this.audioContext.currentTime;

            activeChannel.gainNode.gain.cancelScheduledValues(now);
            activeChannel.gainNode.gain.setValueAtTime(
                track.volume,
                now
            );
          }
          this.autoplayBlocked = false;
          this.notifyListeners();
        } catch (e) {
          console.error("Failed to autoplay:", e);
        }
      }
    });
  }

  isAutoplayBlocked(): boolean {
    return this.autoplayBlocked;
  }
}

export const audioManager = new AudioManager();
