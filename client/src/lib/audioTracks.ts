export interface AudioTrack {
  src: string;
  volume: number;
  loop: boolean;
}

export const AUDIO_TRACKS: Record<string, AudioTrack> = {
  default: {
    src: "/audio/site_ost.mp3",
    volume: 0.5,
    loop: true,
  },
  devlogs: {
    src: "/audio/devlogs.mp3",
    volume: 0.5,
    loop: true,
  },
  systems: {
    src: "/audio/systems.mp3",
    volume: 0.5,
    loop: true,
  },
  archives: {
    src: "/audio/archives.mp3",
    volume: 0.5,
    loop: true,
  },
  gallery: {
    src: "/audio/gallery.mp3",
    volume: 0.5,
    loop: true,
  }
};

export const ROUTE_AUDIO_CONTEXT: Record<string, string> = {
  "/": "default",
  "/devlogs": "devlogs",
  "/systems": "systems",
  "/lore": "archives",
  "/gallery": "gallery",
};

export function getTrackForRoute(route: string): AudioTrack {
  if (ROUTE_AUDIO_CONTEXT[route]) {
    const trackId = ROUTE_AUDIO_CONTEXT[route];
    return AUDIO_TRACKS[trackId] || AUDIO_TRACKS.default;
  }
  
  for (const [routePattern, trackId] of Object.entries(ROUTE_AUDIO_CONTEXT)) {
    if (routePattern !== "/" && route.startsWith(routePattern)) {
      return AUDIO_TRACKS[trackId] || AUDIO_TRACKS.default;
    }
  }
  
  return AUDIO_TRACKS.default;
}

export function getTrackIdForRoute(route: string): string {
  if (ROUTE_AUDIO_CONTEXT[route]) {
    return ROUTE_AUDIO_CONTEXT[route];
  }
  
  for (const [routePattern, trackId] of Object.entries(ROUTE_AUDIO_CONTEXT)) {
    if (routePattern !== "/" && route.startsWith(routePattern)) {
      return trackId;
    }
  }
  
  return "default";
}
