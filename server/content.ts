import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

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
}

export function getDevlogs(): Devlog[] {
  const devlogsPath = path.join(contentDir, 'devlogs');
  
  if (!fs.existsSync(devlogsPath)) {
    return [];
  }

  const files = fs.readdirSync(devlogsPath).filter(file => file.endsWith('.md'));
  
  return files.map((filename, index) => {
    const filePath = path.join(devlogsPath, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      id: filename.replace('.md', ''),
      title: data.title || filename,
      date: data.date || '',
      summary: data.summary || '',
      content: content,
      order: typeof data.order === 'number' ? data.order : index,
      titleColor: data.titleColor || undefined
    };
  }).sort((a, b) => a.order - b.order);
}

export function getDevlogById(id: string): Devlog | null {
  const filePath = path.join(contentDir, 'devlogs', `${id}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    id,
    title: data.title || id,
    date: data.date || '',
    summary: data.summary || '',
    content: content,
    order: typeof data.order === 'number' ? data.order : 0,
    titleColor: data.titleColor || undefined
  };
}

export function getLore(): Lore[] {
  const lorePath = path.join(contentDir, 'lore');
  
  if (!fs.existsSync(lorePath)) {
    return [];
  }

  const files = fs.readdirSync(lorePath).filter(file => file.endsWith('.md'));
  
  return files.map((filename, index) => {
    const filePath = path.join(lorePath, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      id: filename.replace('.md', ''),
      title: data.title || filename,
      category: data.category || 'World',
      summary: data.summary || '',
      content: content,
      order: typeof data.order === 'number' ? data.order : index
    };
  }).sort((a, b) => a.order - b.order);
}

export function getLoreById(id: string): Lore | null {
  const filePath = path.join(contentDir, 'lore', `${id}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    id,
    title: data.title || id,
    category: data.category || 'World',
    summary: data.summary || '',
    content: content,
    order: typeof data.order === 'number' ? data.order : 0
  };
}

export interface SystemDoc {
  id: string;
  title: string;
  summary: string;
  content: string;
  order: number;
  ost?: string;
}

export function getSystems(): SystemDoc[] {
  const systemsPath = path.join(contentDir, 'systems');
  
  if (!fs.existsSync(systemsPath)) {
    return [];
  }

  const files = fs.readdirSync(systemsPath).filter(file => file.endsWith('.md'));
  
  return files.map((filename, index) => {
    const filePath = path.join(systemsPath, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      id: filename.replace('.md', ''),
      title: data.title || filename,
      summary: data.summary || '',
      content: content,
      order: typeof data.order === 'number' ? data.order : index,
      ost: data.ost || undefined
    };
  }).sort((a, b) => a.order - b.order);
}

export function getSystemById(id: string): SystemDoc | null {
  const filePath = path.join(contentDir, 'systems', `${id}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    id,
    title: data.title || id,
    summary: data.summary || '',
    content: content,
    order: typeof data.order === 'number' ? data.order : 0,
    ost: data.ost || undefined
  };
}

export interface GalleryItem {
  id: string;
  filename: string;
  caption: string;
  type: "image" | "video" | "gif";
}

export function getGallery(): GalleryItem[] {
  const galleryPath = path.join(contentDir, 'gallery', 'gallery.json');
  
  if (!fs.existsSync(galleryPath)) {
    return [];
  }

  try {
    const fileContents = fs.readFileSync(galleryPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error parsing gallery.json:', error);
    return [];
  }
}
