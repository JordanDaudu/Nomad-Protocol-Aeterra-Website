export interface Devlog {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  titleColor?: string;
}

export interface Lore {
  id: string;
  title: string;
  category: "World" | "Faction" | "Tech";
  summary: string;
  content: string;
}

export async function fetchDevlogs(): Promise<Devlog[]> {
  const response = await fetch('/api/devlogs');
  if (!response.ok) {
    throw new Error('Failed to fetch devlogs');
  }
  return response.json();
}

export async function fetchDevlogById(id: string): Promise<Devlog> {
  const response = await fetch(`/api/devlogs/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch devlog');
  }
  return response.json();
}

export async function fetchLore(): Promise<Lore[]> {
  const response = await fetch('/api/lore');
  if (!response.ok) {
    throw new Error('Failed to fetch lore');
  }
  return response.json();
}

export async function fetchLoreById(id: string): Promise<Lore> {
  const response = await fetch(`/api/lore/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch lore');
  }
  return response.json();
}

export interface GalleryItem {
  id: string;
  filename: string;
  caption: string;
  type: "image" | "video" | "gif";
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const response = await fetch('/api/gallery');
  if (!response.ok) {
    throw new Error('Failed to fetch gallery');
  }
  return response.json();
}

export interface SystemDoc {
  id: string;
  title: string;
  summary: string;
  content: string;
  order: number;
  ost?: string;
}

export async function fetchSystems(): Promise<SystemDoc[]> {
  const response = await fetch('/api/systems');
  if (!response.ok) {
    throw new Error('Failed to fetch systems');
  }
  return response.json();
}

export async function fetchSystemById(id: string): Promise<SystemDoc> {
  const response = await fetch(`/api/systems/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch system');
  }
  return response.json();
}
