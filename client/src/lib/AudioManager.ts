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

  // Track loaded in this channel (so we can resume + pause correctly)
  trackId: string;
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

  // resume positions per track
  private trackPositions: Record<string, number> = {};

  // prevents old async transitions from “winning” after a newer route change
  private transitionSeq: number = 0;

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(MUTE_STORAGE_KEY);
      this.isMuted = stored === "true";
    }
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

  private createChannel(track: AudioTrack, trackId: string): AudioChannel {
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
      trackId,
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

      // iOS/Safari unlock tick
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

  private getTrackById(trackId: string): AudioTrack {
    return AUDIO_TRACKS[trackId] || AUDIO_TRACKS.default;
  }

  private savePosition(channel: AudioChannel | null): void {
    if (!channel) return;
    const t = channel.audio.currentTime;
    if (Number.isFinite(t) && t >= 0) {
      this.trackPositions[channel.trackId] = t;
    }
  }

  private async waitUntilReady(audio: HTMLAudioElement): Promise<void> {
    // canplaythrough is not guaranteed on mobile; loadedmetadata is safer
    await new Promise<void>((resolve) => {
      let resolved = false;

      const finish = () => {
        if (resolved) return;
        resolved = true;
        audio.removeEventListener("loadedmetadata", finish);
        audio.removeEventListener("canplay", finish);
        audio.removeEventListener("canplaythrough", finish);
        resolve();
      };

      audio.addEventListener("loadedmetadata", finish);
      audio.addEventListener("canplay", finish);
      audio.addEventListener("canplaythrough", finish);

      // fallback
      setTimeout(finish, 1500);
    });
  }

  private applySafeResumeTime(audio: HTMLAudioElement, resumeTime: number): void {
    try {
      const dur = audio.duration;
      const desired = Math.max(resumeTime || 0, 0);

      if (Number.isFinite(dur) && dur > 0) {
        // clamp
        let safe = Math.min(desired, Math.max(0, dur - 0.05));

        // if we’re extremely close to end, just restart (prevents instant loop feeling)
        if (dur - safe < 0.25) safe = 0;

        audio.currentTime = safe;
      } else {
        audio.currentTime = desired;
      }
    } catch {
      // ignore seek failures
    }
  }

  private async ensureChannelHasTrack(
      channel: AudioChannel,
      track: AudioTrack,
      trackId: string
  ): Promise<void> {
    const needsLoad = channel.trackId !== trackId || channel.audio.src !== track.src;

    if (needsLoad) {
      // save old track position before overwriting
      this.savePosition(channel);

      channel.trackId = trackId;
      channel.audio.src = track.src;
      channel.audio.loop = track.loop;
      channel.audio.load();
    } else {
      channel.audio.loop = track.loop;
    }

    await this.waitUntilReady(channel.audio);

    const resumeTime = this.trackPositions[trackId] ?? 0;
    this.applySafeResumeTime(channel.audio, resumeTime);
  }

  private async playCurrentFromUserGesture(): Promise<void> {
    if (!this.audioContext) return;

    await this.unlockAudio();
    if (this.isMuted) return;

    const active = this.getActiveChannel();
    if (!active) return;

    const track = this.getTrackById(this.currentTrackId);

    // Ensure the active channel actually holds the current track (fixes “enter non-main route”)
    await this.ensureChannelHasTrack(active, track, this.currentTrackId);

    try {
      await active.audio.play();
      this.autoplayBlocked = false;

      if (active.gainNode) {
        active.gainNode.gain.setValueAtTime(
            track.volume,
            this.audioContext.currentTime
        );
      }

      this.notifyListeners();
    } catch {
      this.autoplayBlocked = true;
      this.notifyListeners();
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.audioContext = this.createAudioContext();

    const defaultTrack = AUDIO_TRACKS.default;
    this.channelA = this.createChannel(defaultTrack, "default");
    this.channelB = this.createChannel(defaultTrack, "default");

    this.connectChannel(this.channelA);
    this.connectChannel(this.channelB);

    this.isInitialized = true;

    // ✅ IMPORTANT FIX:
    // First gesture should start the *current track*, not always channelA/default.
    const handleUserInteraction = async () => {
      await this.playCurrentFromUserGesture();
    };

    // pointerdown is more reliable on mobile than click alone
    document.addEventListener("pointerdown", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, { once: true });
    document.addEventListener("click", handleUserInteraction, { once: true });

    // Desktop may succeed; mobile likely fails and sets autoplayBlocked.
    if (!this.isMuted) {
      await this.playCurrentFromUserGesture();
    }
  }

  async setContext(route: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const trackId = getTrackIdForRoute(route);
    if (trackId === this.currentTrackId) return;

    const track = getTrackForRoute(route);
    const seq = ++this.transitionSeq;

    await this.crossfadeTo(track, trackId, seq);
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

    const seq = ++this.transitionSeq;
    await this.crossfadeTo(track, trackId, seq);
  }

  private async crossfadeTo(track: AudioTrack, trackId: string, seq: number): Promise<void> {
    const fadeOutChannel = this.getActiveChannel();
    const fadeInChannel = this.getInactiveChannel();

    if (!fadeOutChannel || !fadeInChannel || !this.audioContext) return;

    const outgoingTrackId = this.currentTrackId;
    const halfDurationSec = FADE_DURATION / 2000;

    // Prepare new track in fade-in channel and seek to resume time
    if (fadeInChannel.gainNode) fadeInChannel.gainNode.gain.value = 0;
    await this.ensureChannelHasTrack(fadeInChannel, track, trackId);

    // If a newer transition started, abandon this one
    if (seq !== this.transitionSeq) return;

    // If muted OR nothing is currently playing OR audio context likely still locked,
    // do a “silent switch”: update state and wait for user gesture to start playback.
    const noAudioCurrentlyPlaying = fadeOutChannel.audio.paused;
    const contextLocked = this.audioContext.state === "suspended" && !this.isUnlocked;

    if (this.isMuted || noAudioCurrentlyPlaying || contextLocked) {
      // save outgoing position and stop outgoing audio
      this.savePosition(fadeOutChannel);
      fadeOutChannel.audio.pause();
      fadeOutChannel.audio.currentTime = 0;

      if (fadeOutChannel.gainNode) fadeOutChannel.gainNode.gain.value = 0;
      if (fadeInChannel.gainNode) fadeInChannel.gainNode.gain.value = 0;

      // swap active to the channel that holds the new track
      this.activeChannel = this.activeChannel === "A" ? "B" : "A";
      this.currentTrackId = trackId;

      // On mobile this is the correct state: audio needs a gesture to start.
      if (!this.isMuted) {
        this.autoplayBlocked = true;
      }
      this.notifyListeners();
      return;
    }

    // Phase 1: fade out current track
    const fadeOutStartTime = this.audioContext.currentTime;

    if (fadeOutChannel.gainNode) {
      const currentGain = fadeOutChannel.gainNode.gain.value;
      fadeOutChannel.gainNode.gain.cancelScheduledValues(fadeOutStartTime);
      fadeOutChannel.gainNode.gain.setValueAtTime(currentGain, fadeOutStartTime);
      fadeOutChannel.gainNode.gain.linearRampToValueAtTime(
          0,
          fadeOutStartTime + halfDurationSec
      );
    }

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

    // If a newer transition started, abandon this one
    if (seq !== this.transitionSeq) return;

    // Phase 2: start new track (while old one is still playing at 0 gain)
    try {
      await fadeInChannel.audio.play();
      this.autoplayBlocked = false;
    } catch (e) {
      console.error("Failed to play new track:", e);

      // ✅ IMPORTANT FIX:
      // Do NOT swap state. Restore old volume so we don’t get stuck on “old audio/state mismatch”.
      const outgoingTrack = this.getTrackById(outgoingTrackId);
      const restoreVol = this.isMuted ? 0 : outgoingTrack.volume;

      const now = this.audioContext.currentTime;
      if (fadeOutChannel.gainNode) {
        fadeOutChannel.gainNode.gain.cancelScheduledValues(now);
        fadeOutChannel.gainNode.gain.setValueAtTime(fadeOutChannel.gainNode.gain.value, now);
        fadeOutChannel.gainNode.gain.linearRampToValueAtTime(restoreVol, now + 0.2);
      }

      // Stop/reset the attempted new channel
      try {
        fadeInChannel.audio.pause();
        fadeInChannel.audio.currentTime = 0;
      } catch {}

      this.autoplayBlocked = true;
      this.notifyListeners();
      return;
    }

    // Save outgoing position and stop old track
    this.trackPositions[outgoingTrackId] = fadeOutChannel.audio.currentTime || 0;
    fadeOutChannel.audio.pause();
    fadeOutChannel.audio.currentTime = 0;

    // Fade in the new track
    const fadeInStartTime = this.audioContext.currentTime;
    const targetVolume = this.isMuted ? 0 : track.volume;

    if (fadeInChannel.gainNode) {
      fadeInChannel.gainNode.gain.cancelScheduledValues(fadeInStartTime);
      fadeInChannel.gainNode.gain.setValueAtTime(0, fadeInStartTime);
      fadeInChannel.gainNode.gain.linearRampToValueAtTime(
          targetVolume,
          fadeInStartTime + halfDurationSec
      );
    }

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

    if (seq !== this.transitionSeq) return;

    // Swap active channel + current track
    this.activeChannel = this.activeChannel === "A" ? "B" : "A";
    this.currentTrackId = trackId;

    this.notifyListeners();
  }

  resetToDefault(): void {
    void this.setContext("/");
  }

  async toggleMute(): Promise<void> {
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
    const fadeDuration = 0.3;

    // Save positions before we potentially pause
    this.savePosition(activeChannel);
    this.savePosition(inactiveChannel);

    if (this.isMuted) {
      // Fade both down then pause (prevents “old track keeps running” issues)
      const fadeDown = (ch: AudioChannel | null) => {
        if (!ch?.gainNode) return;
        ch.gainNode.gain.cancelScheduledValues(now);
        ch.gainNode.gain.setValueAtTime(ch.gainNode.gain.value, now);
        ch.gainNode.gain.linearRampToValueAtTime(0, now + fadeDuration);
      };

      fadeDown(activeChannel);
      fadeDown(inactiveChannel);

      setTimeout(() => {
        try {
          activeChannel?.audio.pause();
          inactiveChannel?.audio.pause();
        } catch {}
      }, fadeDuration * 1000 + 50);
    } else {
      // Unmute: ensure we’re playing the CURRENT track (fixes “unmute still old audio”)
      const track = this.getTrackById(this.currentTrackId);

      if (activeChannel) {
        await this.ensureChannelHasTrack(activeChannel, track, this.currentTrackId);

        if (activeChannel.audio.paused) {
          try {
            await activeChannel.audio.play();
            this.autoplayBlocked = false;
          } catch (e) {
            console.error("Failed to resume audio:", e);
            this.autoplayBlocked = true;
          }
        }

        if (activeChannel.gainNode) {
          activeChannel.gainNode.gain.cancelScheduledValues(now);
          activeChannel.gainNode.gain.setValueAtTime(0, now);
          activeChannel.gainNode.gain.linearRampToValueAtTime(
              track.volume,
              now + fadeDuration
          );
        }
      }
    }

    this.notifyListeners();
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
    if (!this.isInitialized) {
      await this.initialize();
      return;
    }

    await this.playCurrentFromUserGesture();
  }

  isAutoplayBlocked(): boolean {
    return this.autoplayBlocked;
  }
}

export const audioManager = new AudioManager();
