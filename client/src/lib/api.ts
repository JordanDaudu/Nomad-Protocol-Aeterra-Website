export interface Devlog {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  order: number;
  titleColor?: string;
}

export interface Lore {
  id: string;
  title: string;
  category: "World" | "Faction" | "Tech";
  summary: string;
  content: string;
  order: number;
  loreImage?: string;
}

export interface GalleryItem {
  id: string;
  filename: string;
  caption: string;
  type: "image" | "video" | "gif";
}

export interface SystemDoc {
  id: string;
  title: string;
  summary: string;
  content: string;
  order: number;
  ost?: string;
}

export async function fetchDevlogs(): Promise<Devlog[]> {
  const response = await fetch('/data/devlogs.json');
  if (!response.ok) throw new Error('Failed to fetch devlogs');
  return response.json();
}

export async function fetchDevlogById(id: string): Promise<Devlog> {
  const devlogs = await fetchDevlogs();
  const found = devlogs.find(d => d.id === id);
  if (!found) throw new Error('Devlog not found');
  return found;
}

export async function fetchLore(): Promise<Lore[]> {
  const response = await fetch('/data/lore.json');
  if (!response.ok) throw new Error('Failed to fetch lore');
  return response.json();
}

export async function fetchLoreById(id: string): Promise<Lore> {
  const lore = await fetchLore();
  const found = lore.find(l => l.id === id);
  if (!found) throw new Error('Lore entry not found');
  return found;
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const response = await fetch('/data/gallery.json');
  if (!response.ok) throw new Error('Failed to fetch gallery');
  return response.json();
}

export async function fetchSystems(): Promise<SystemDoc[]> {
  const response = await fetch('/data/systems.json');
  if (!response.ok) throw new Error('Failed to fetch systems');
  return response.json();
}
