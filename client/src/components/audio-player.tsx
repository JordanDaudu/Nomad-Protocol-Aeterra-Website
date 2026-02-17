import { useAudioContext } from "@/hooks/useAudioContext";
import { audioManager } from "@/lib/AudioManager"; // needed for the final check

export default function AudioPlayer() {
    const { isMuted, isPlaying, autoplayBlocked, toggleMute, tryAutoplay } = useAudioContext();

    const handleClick = async () => {
        // If audio is supposed to be on (not muted) but the browser blocked autoplay,
        // use this click to unlock/start audio.
        if (autoplayBlocked && !isMuted) {
            await tryAutoplay();
            return;
        }

        // Normal toggle
        await toggleMute();

        // If we just unmuted, attempt to start immediately under the same user gesture
        if (!audioManager.getMuted()) {
            await tryAutoplay();
        }
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-2 px-2 py-1 border border-border hover:border-primary/50 bg-card/50 transition-all group"
            title={isPlaying ? "Mute ambient audio" : "Play ambient audio"}
            data-testid="audio-toggle"
        >
      <span className="font-terminal text-xs text-muted-foreground group-hover:text-foreground transition-colors">
        AUD.SYS
      </span>
            <span className={`text-xs font-terminal ${isPlaying ? "text-primary animate-pulse" : "text-destructive"}`}>
        [{isPlaying ? "▶ ON" : "■ OFF"}]
      </span>
        </button>
    );
}
