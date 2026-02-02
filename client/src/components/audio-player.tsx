import { useAudioContext } from "@/hooks/useAudioContext";

export default function AudioPlayer() {
  const { isPlaying, autoplayBlocked, toggleMute, tryAutoplay } = useAudioContext();

  const handleClick = () => {
    if (autoplayBlocked) {
      tryAutoplay();
    } else {
      toggleMute();
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
      <span className={`text-xs font-terminal ${isPlaying ? 'text-primary animate-pulse' : 'text-destructive'}`}>
        [{isPlaying ? '▶ ON' : '■ OFF'}]
      </span>
    </button>
  );
}
