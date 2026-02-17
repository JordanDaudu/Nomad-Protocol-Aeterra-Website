import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { audioManager } from "@/lib/AudioManager";

export function useAudioContext() {
  const [location] = useLocation();
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    audioManager.initialize();

    const unsubscribe = audioManager.subscribe((muted) => {
      setIsMuted(muted);
      setAutoplayBlocked(audioManager.isAutoplayBlocked());
    });

    const checkAutoplay = setTimeout(() => {
      setAutoplayBlocked(audioManager.isAutoplayBlocked());
    }, 100);

    return () => {
      unsubscribe();
      clearTimeout(checkAutoplay);
    };
  }, []);

  useEffect(() => {
    audioManager.setContext(location);
  }, [location]);

  const toggleMute = () => {
    audioManager.toggleMute();
  };

  const tryAutoplay = () => {
    audioManager.tryAutoplay();
    setAutoplayBlocked(false);
  };

  const isPlaying = !isMuted && !autoplayBlocked;

  return { isMuted, isPlaying, autoplayBlocked, toggleMute, tryAutoplay };
}
