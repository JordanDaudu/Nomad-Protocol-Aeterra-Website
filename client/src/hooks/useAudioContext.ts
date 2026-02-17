import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { audioManager } from "@/lib/AudioManager";

export function useAudioContext() {
  const [location] = useLocation();

  const [isMuted, setIsMuted] = useState(audioManager.getMuted());
  const [autoplayBlocked, setAutoplayBlocked] = useState(audioManager.isAutoplayBlocked());

  useEffect(() => {
    // Initialize (don’t block render, but do keep state truthful after it runs)
    void audioManager.initialize();

    const syncFromManager = () => {
      setIsMuted(audioManager.getMuted());
      setAutoplayBlocked(audioManager.isAutoplayBlocked());
    };

    // Subscribe to mute changes, but always read both values from manager
    const unsubscribe = audioManager.subscribe(() => {
      syncFromManager();
    });

    // One early sync in case autoplayBlocked was set during init play attempt
    const t = setTimeout(syncFromManager, 100);

    return () => {
      unsubscribe();
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    // Serialize route changes inside AudioManager; still await to avoid UI surprises
    void audioManager.setContext(location);
  }, [location]);

  const toggleMute = useCallback(async () => {
    await audioManager.toggleMute();
    // Ensure local state reflects reality even if listener timing is off
    setIsMuted(audioManager.getMuted());
    setAutoplayBlocked(audioManager.isAutoplayBlocked());
  }, []);

  const tryAutoplay = useCallback(async () => {
    await audioManager.tryAutoplay();
    // DO NOT optimistically force false; read the actual state.
    setAutoplayBlocked(audioManager.isAutoplayBlocked());
    setIsMuted(audioManager.getMuted());
  }, []);

  // For UI purposes, "playing" means: user didn't mute AND browser isn't blocking.
  const isPlaying = !isMuted && !autoplayBlocked;

  return { isMuted, isPlaying, autoplayBlocked, toggleMute, tryAutoplay };
}
