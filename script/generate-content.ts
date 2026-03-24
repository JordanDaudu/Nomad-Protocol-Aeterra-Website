import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const contentDir = path.join(ROOT, 'content');
const publicDir = path.join(ROOT, 'client', 'public');
const outputDir = path.join(publicDir, 'data');

fs.mkdirSync(outputDir, { recursive: true });

function write(filename: string, data: unknown) {
  fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(data, null, 2), 'utf8');
  console.log(`  wrote data/${filename}`);
}

function resetDir(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function syncDirectoryContents(
    srcDir: string,
    destDir: string,
    options?: {
      filter?: (sourcePath: string) => boolean;
    }
) {
  resetDir(destDir);

  if (!fs.existsSync(srcDir)) {
    console.log(`  skipped ${path.relative(ROOT, srcDir)} (not found)`);
    return;
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }

    const sourcePath = path.join(srcDir, entry.name);
    if (options?.filter && !options.filter(sourcePath)) {
      continue;
    }

    const destinationPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      fs.cpSync(sourcePath, destinationPath, {
        recursive: true,
        filter: (copiedSource) => !path.basename(copiedSource).startsWith('.'),
      });
      continue;
    }

    fs.copyFileSync(sourcePath, destinationPath);
  }

  console.log(`  synced ${path.relative(ROOT, srcDir)} -> ${path.relative(ROOT, destDir)}`);
}

function syncPublicAssets() {
  console.log('Syncing public assets...');

  syncDirectoryContents(
      path.join(contentDir, 'gallery'),
      path.join(publicDir, 'gallery-images'),
      {
        filter: (sourcePath) => path.extname(sourcePath).toLowerCase() !== '.json',
      }
  );

  syncDirectoryContents(
      path.join(ROOT, 'attached_assets', 'devlog_assets'),
      path.join(publicDir, 'devlog-assets')
  );

  syncDirectoryContents(
      path.join(ROOT, 'attached_assets', 'audio'),
      path.join(publicDir, 'audio')
  );
}

function generateDevlogs() {
  const devlogsPath = path.join(contentDir, 'devlogs');
  if (!fs.existsSync(devlogsPath)) return write('devlogs.json', []);

  const files = fs.readdirSync(devlogsPath).filter(f => f.endsWith('.md'));
  const devlogs = files.map((filename, index) => {
    const fileContents = fs.readFileSync(path.join(devlogsPath, filename), 'utf8');
    const { data, content } = matter(fileContents);
    return {
      id: filename.replace(/\.md$/, ''),
      title: data.title || filename,
      date: data.date || '',
      summary: data.summary || '',
      content,
      order: typeof data.order === 'number' ? data.order : index,
      ...(data.titleColor ? { titleColor: data.titleColor } : {}),
    };
  }).sort((a, b) => a.order - b.order);

  write('devlogs.json', devlogs);
}

function generateLore() {
  const lorePath = path.join(contentDir, 'lore');
  if (!fs.existsSync(lorePath)) return write('lore.json', []);

  const files = fs.readdirSync(lorePath).filter(f => f.endsWith('.md'));
  const lore = files.map((filename, index) => {
    const fileContents = fs.readFileSync(path.join(lorePath, filename), 'utf8');
    const { data, content } = matter(fileContents);
    return {
      id: filename.replace(/\.md$/, ''),
      title: data.title || filename,
      category: data.category || 'World',
      summary: data.summary || '',
      content,
      order: typeof data.order === 'number' ? data.order : index,
      ...(data.loreImage ? { loreImage: data.loreImage } : {}),
    };
  }).sort((a, b) => a.order - b.order);

  write('lore.json', lore);
}

function generateGallery() {
  const galleryPath = path.join(contentDir, 'gallery', 'gallery.json');
  if (!fs.existsSync(galleryPath)) return write('gallery.json', []);
  const raw = fs.readFileSync(galleryPath, 'utf8');
  write('gallery.json', JSON.parse(raw));
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

interface TreeNode {
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
  children?: TreeNode[];
}

function scanDir(dirPath: string, relDir: string): TreeNode {
  const folderName = path.basename(dirPath);
  const folderSlug = relDir ? slugify(stripNumericPrefix(folderName)) : 'systems';
  const node: TreeNode = {
    type: 'folder',
    title: relDir ? stripNumericPrefix(folderName).replace(/[-_]/g, ' ') : 'Systems',
    slug: folderSlug,
    relPath: relDir,
    children: [],
  };

  if (!fs.existsSync(dirPath)) return node;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }

    if (entry.isDirectory()) {
      const childRelDir = relDir ? `${relDir}/${entry.name}` : entry.name;
      node.children!.push(scanDir(path.join(dirPath, entry.name), childRelDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const filePath = path.join(dirPath, entry.name);
      const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
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

      const doc: TreeNode = {
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

function sortChildren(node: TreeNode) {
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

function flattenDocs(node: TreeNode, results: TreeNode[] = []): TreeNode[] {
  if (node.type === 'doc' && !node.isIndex) results.push(node);
  if (node.children) {
    for (const child of node.children) flattenDocs(child, results);
  }
  return results;
}

function generateSystems() {
  const systemsPath = path.join(contentDir, 'systems');
  const tree = scanDir(systemsPath, '');
  write('systems-tree.json', tree);

  const flat = flattenDocs(tree);
  write('systems.json', flat);
}

console.log('Generating static content...');
syncPublicAssets();
generateDevlogs();
generateLore();
generateGallery();
generateSystems();
console.log('Content generation complete.');