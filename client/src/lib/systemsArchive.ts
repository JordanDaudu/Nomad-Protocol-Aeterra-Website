export type DocNode = {
  type: "folder" | "doc";
  title: string;
  summary?: string;
  order?: number;
  status?: string;
  tags?: string[];
  last_updated?: string;
  slug: string;
  route: string;
  relPath: string;
  content?: string;
  isIndex?: boolean;
  ost?: string;
  children?: DocNode[];
};

type ServerNode = {
  type: "folder" | "doc";
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
  children?: ServerNode[];
};

function assignRoutes(node: ServerNode, parentRoute: string): DocNode {
  const route = node.type === "doc" && node.isIndex
    ? parentRoute
    : parentRoute === "/systems"
      ? `/systems/${node.slug}`
      : `${parentRoute}/${node.slug}`;

  const docNode: DocNode = {
    ...node,
    route: node.type === "folder" ? (parentRoute === "/systems" && node.relPath === "" ? "/systems" : (parentRoute === "/systems" ? `/systems/${node.slug}` : `${parentRoute}/${node.slug}`)) : route,
    children: undefined,
  };

  if (node.children) {
    const folderRoute = docNode.route;
    docNode.children = node.children.map((child) =>
      assignRoutes(child, folderRoute)
    );
  }

  return docNode;
}

function buildLookups(
  node: DocNode,
  routeMap: Map<string, DocNode>,
  folderRouteMap: Map<string, DocNode>,
  allDocs: DocNode[]
) {
  if (node.type === "doc") {
    routeMap.set(node.route, node);
    allDocs.push(node);
  }
  if (node.type === "folder") {
    folderRouteMap.set(node.route, node);
  }
  if (node.children) {
    for (const child of node.children) {
      buildLookups(child, routeMap, folderRouteMap, allDocs);
    }
  }
}

export function processTree(serverTree: ServerNode): {
  tree: DocNode;
  routeMap: Map<string, DocNode>;
  folderRouteMap: Map<string, DocNode>;
  allDocs: DocNode[];
} {
  const tree = assignRoutes(serverTree, "/systems");
  const routeMap = new Map<string, DocNode>();
  const folderRouteMap = new Map<string, DocNode>();
  const allDocs: DocNode[] = [];
  buildLookups(tree, routeMap, folderRouteMap, allDocs);
  return { tree, routeMap, folderRouteMap, allDocs };
}

export function getDocByRoute(
  routeMap: Map<string, DocNode>,
  route: string
): DocNode | undefined {
  const normalized = route.replace(/\/+$/, "") || "/systems";
  return routeMap.get(normalized);
}

export function getFolderByRoute(
  folderRouteMap: Map<string, DocNode>,
  route: string
): DocNode | undefined {
  const normalized = route.replace(/\/+$/, "") || "/systems";
  return folderRouteMap.get(normalized);
}

export function searchDocs(allDocs: DocNode[], query: string): DocNode[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return allDocs.filter((doc) => {
    if (doc.isIndex) return false;
    if (doc.title.toLowerCase().includes(q)) return true;
    if (doc.summary?.toLowerCase().includes(q)) return true;
    if (doc.tags?.some((t) => t.toLowerCase().includes(q))) return true;
    return false;
  });
}

export function getVisibleChildren(node: DocNode): DocNode[] {
  if (!node.children) return [];
  return node.children.filter((c) => !c.isIndex);
}

export function resolveRelativeLink(
  allDocs: DocNode[],
  href: string,
  currentDocRelPath: string
): DocNode | undefined {
  if (!href.endsWith(".md")) return undefined;

  const currentDir = currentDocRelPath.includes("/")
    ? currentDocRelPath.substring(0, currentDocRelPath.lastIndexOf("/"))
    : "";

  const parts = href.split("/");
  const segments = currentDir ? currentDir.split("/") : [];

  for (const part of parts) {
    if (part === "." || part === "") continue;
    if (part === "..") {
      segments.pop();
    } else {
      segments.push(part);
    }
  }

  const resolvedPath = segments.join("/");
  return allDocs.find((d) => d.relPath === resolvedPath);
}
