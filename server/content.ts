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

export interface SystemsTreeNode {
  type: 'folder' | 'doc';
  title: string;
  summary?: string;
  order?: number;
  status?: string;
  tags?: string[];
  last_updated?: string;
  slug: string;
  relPath: string;
  content?: string;
  isIndex?: boolean;
  ost?: string;
  children?: SystemsTreeNode[];
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function stripNumericPrefix(name: string): string {
  return name.replace(/^\d+[-_\s]*/, '');
}

function getNumericPrefix(name: string): number | null {
  const match = name.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function isIndexFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  return lower.startsWith('00') && lower.includes('index');
}

function scanSystemsDir(dirPath: string, relDir: string): SystemsTreeNode {
  const folderName = path.basename(dirPath);
  const folderSlug = relDir ? slugify(stripNumericPrefix(folderName)) : 'systems';
  const node: SystemsTreeNode = {
    type: 'folder',
    title: relDir ? stripNumericPrefix(folderName).replace(/[-_]/g, ' ') : 'Systems',
    slug: folderSlug,
    relPath: relDir,
    children: [],
  };

  if (!fs.existsSync(dirPath)) return node;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const childRelDir = relDir ? `${relDir}/${entry.name}` : entry.name;
      const childNode = scanSystemsDir(path.join(dirPath, entry.name), childRelDir);
      node.children!.push(childNode);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const filePath = path.join(dirPath, entry.name);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const filenameNoExt = entry.name.replace(/\.md$/, '');
      const isIdx = isIndexFile(entry.name);
      const docTitle = data.title || stripNumericPrefix(filenameNoExt).replace(/[-_]/g, ' ');
      const docSlug = slugify(data.title || stripNumericPrefix(filenameNoExt));
      const docRelPath = relDir ? `${relDir}/${entry.name}` : entry.name;

      const tags = data.tags
          ? (typeof data.tags === 'string'
              ? data.tags.split(',').map((t: string) => t.trim())
              : Array.isArray(data.tags) ? data.tags : [])
          : undefined;

      const doc: SystemsTreeNode = {
        type: 'doc',
        title: docTitle,
        summary: data.summary || undefined,
        order: typeof data.order === 'number' ? data.order : undefined,
        status: data.status || undefined,
        tags,
        last_updated: data.last_updated || undefined,
        slug: docSlug,
        relPath: docRelPath,
        content,
        isIndex: isIdx || undefined,
        ost: data.ost || undefined,
      };

      if (isIdx) {
        node.title = docTitle;
        node.summary = data.summary || undefined;
        node.order = data.order;
      }

      node.children!.push(doc);
    }
  }

  sortChildren(node);
  return node;
}

function sortChildren(node: SystemsTreeNode) {
  if (!node.children) return;
  node.children.sort((a, b) => {
    if (a.isIndex) return -1;
    if (b.isIndex) return 1;
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    if (a.order != null && b.order != null) return a.order - b.order;
    if (a.order != null) return -1;
    if (b.order != null) return 1;
    const aPrefix = getNumericPrefix(a.relPath.split('/').pop() || '');
    const bPrefix = getNumericPrefix(b.relPath.split('/').pop() || '');
    if (aPrefix != null && bPrefix != null) return aPrefix - bPrefix;
    if (aPrefix != null) return -1;
    if (bPrefix != null) return 1;
    return a.title.localeCompare(b.title);
  });
  for (const child of node.children) {
    if (child.type === 'folder') sortChildren(child);
  }
}

export function getSystemsTree(): SystemsTreeNode {
  const systemsPath = path.join(contentDir, 'systems');
  return scanSystemsDir(systemsPath, '');
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
