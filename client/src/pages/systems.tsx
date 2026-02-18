import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Search, ChevronRight, ChevronDown, FileText, Folder, FolderOpen, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  processTree,
  getDocByRoute,
  getFolderByRoute,
  getVisibleChildren,
  searchDocs,
  resolveRelativeLink,
  type DocNode,
} from "@/lib/systemsArchive";

const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
function isVideoUrl(src: string): boolean {
  return videoExtensions.some((ext) => src.toLowerCase().endsWith(ext));
}

function TreeNode({
  node,
  currentRoute,
  onNavigate,
  depth = 0,
}: {
  node: DocNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
  depth?: number;
}) {
  const isActive = currentRoute === node.route;
  const isParentOfActive = currentRoute.startsWith(node.route + "/");
  const [expanded, setExpanded] = useState(isParentOfActive || isActive || depth === 0);

  useEffect(() => {
    if (isParentOfActive || isActive) {
      setExpanded(true);
    }
  }, [isParentOfActive, isActive]);

  const visibleChildren = getVisibleChildren(node);

  if (node.type === "doc") {
    return (
      <button
        onClick={() => onNavigate(node.route)}
        className={`tree-item w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm font-terminal transition-all duration-200 ${
          isActive
            ? "text-primary bg-primary/10 border-l-2 border-primary tree-item-active"
            : "text-muted-foreground hover:text-foreground hover:bg-white/5 border-l-2 border-transparent"
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        data-testid={`tree-doc-${node.slug}`}
      >
        <FileText className="w-3.5 h-3.5 shrink-0 opacity-50" />
        <span className="truncate">{node.title}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => {
          setExpanded(!expanded);
          if (node.route !== "/systems") {
            onNavigate(node.route);
          }
        }}
        className={`tree-item w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm font-terminal transition-all duration-200 ${
          isActive
            ? "text-primary bg-primary/10 border-l-2 border-primary tree-item-active"
            : "text-muted-foreground hover:text-foreground hover:bg-white/5 border-l-2 border-transparent"
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        data-testid={`tree-folder-${node.slug}`}
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-50" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
        )}
        {expanded ? (
          <FolderOpen className="w-3.5 h-3.5 shrink-0 text-secondary opacity-70" />
        ) : (
          <Folder className="w-3.5 h-3.5 shrink-0 text-secondary opacity-70" />
        )}
        <span className="truncate">{node.title}</span>
      </button>

      <div
        className={`tree-children overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {visibleChildren.map((child) => (
          <TreeNode
            key={child.route}
            node={child}
            currentRoute={currentRoute}
            onNavigate={onNavigate}
            depth={depth + 1}
          />
        ))}
      </div>
    </div>
  );
}

function Breadcrumbs({ route }: { route: string }) {
  const [, setLocation] = useLocation();
  const parts = route.replace("/systems", "").split("/").filter(Boolean);
  const crumbs = [{ label: "SYS", route: "/systems" }];
  let currentPath = "/systems";
  for (const part of parts) {
    currentPath += `/${part}`;
    crumbs.push({ label: part.toUpperCase().replace(/-/g, "_"), route: currentPath });
  }

  return (
    <div className="flex items-center gap-1 font-terminal text-xs text-muted-foreground overflow-x-auto whitespace-nowrap">
      {crumbs.map((crumb, i) => (
        <span key={crumb.route} className="flex items-center gap-1">
          {i > 0 && <span className="text-border">/</span>}
          <button
            onClick={() => setLocation(crumb.route)}
            className={`hover:text-primary transition-colors ${
              i === crumbs.length - 1 ? "text-primary" : ""
            }`}
            data-testid={`breadcrumb-${i}`}
          >
            {crumb.label}
          </button>
        </span>
      ))}
      <span className="text-primary animate-pulse ml-1">_</span>
    </div>
  );
}

function DocViewer({
  doc,
  allDocs,
  onNavigate,
}: {
  doc: DocNode;
  allDocs: DocNode[];
  onNavigate: (route: string) => void;
}) {
  const markdownComponents = useMemo(
    () => ({
      img: ({ src, alt }: { src?: string; alt?: string }) => {
        if (src && isVideoUrl(src)) {
          return (
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-2xl mx-auto my-4 rounded border border-border"
            >
              {alt}
            </video>
          );
        }
        return <img src={src} alt={alt} className="max-w-full h-auto" />;
      },
      a: ({
        href,
        children,
      }: {
        href?: string;
        children?: React.ReactNode;
      }) => {
        if (href && href.endsWith(".md") && (href.startsWith("./") || href.startsWith("../"))) {
          const target = resolveRelativeLink(allDocs, href, doc.relPath);
          if (target) {
            return (
              <button
                onClick={() => onNavigate(target.route)}
                className="text-primary hover:text-primary/80 underline underline-offset-2 cursor-pointer transition-colors"
              >
                {children}
              </button>
            );
          }
        }
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline underline-offset-2"
          >
            {children}
          </a>
        );
      },
      table: ({ children }: { children?: React.ReactNode }) => (
        <div className="overflow-x-auto my-4">
          <table className="w-full border-collapse border border-border font-terminal text-sm">
            {children}
          </table>
        </div>
      ),
      th: ({ children }: { children?: React.ReactNode }) => (
        <th className="border border-border bg-muted/30 px-3 py-2 text-left text-secondary font-bold">
          {children}
        </th>
      ),
      td: ({ children }: { children?: React.ReactNode }) => (
        <td className="border border-border px-3 py-2">{children}</td>
      ),
    }),
    [doc.relPath, allDocs, onNavigate]
  );

  return (
    <div>
      <div className="border-b border-border pb-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-primary mb-2">
          {doc.title}
        </h1>
        {doc.summary && (
          <p className="text-muted-foreground font-terminal text-sm">
            {doc.summary}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {doc.status && (
            <span className="font-terminal text-[10px] px-2 py-0.5 border border-secondary/30 text-secondary bg-secondary/5">
              STATUS: {doc.status.toUpperCase()}
            </span>
          )}
          {doc.tags?.map((tag) => (
            <span
              key={tag}
              className="font-terminal text-[10px] px-2 py-0.5 border border-border text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {doc.last_updated && (
            <span className="font-terminal text-[10px] px-2 py-0.5 text-muted-foreground">
              UPDATED: {doc.last_updated}
            </span>
          )}
        </div>
      </div>

      <article className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {doc.content || ""}
        </ReactMarkdown>
      </article>
    </div>
  );
}

function FolderListing({
  node,
  onNavigate,
}: {
  node: DocNode;
  onNavigate: (route: string) => void;
}) {
  const children = getVisibleChildren(node);
  const folders = children.filter((c) => c.type === "folder");
  const docs = children.filter((c) => c.type === "doc");

  return (
    <div>
      <h1 className="text-3xl font-bold font-display tracking-tight text-primary mb-2">
        {node.title}
      </h1>
      {node.summary && (
        <p className="text-muted-foreground font-terminal text-sm mb-6">
          {node.summary}
        </p>
      )}

      {folders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-terminal text-secondary uppercase tracking-wider mb-3">
            Subsystems
          </h2>
          <div className="grid gap-2">
            {folders.map((f) => (
              <button
                key={f.route}
                onClick={() => onNavigate(f.route)}
                className="text-left p-3 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                data-testid={`listing-folder-${f.slug}`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-secondary" />
                  <span className="font-display font-bold group-hover:text-primary transition-colors">
                    {f.title}
                  </span>
                </div>
                {f.summary && (
                  <p className="text-muted-foreground text-sm mt-1 ml-6">
                    {f.summary}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {docs.length > 0 && (
        <div>
          <h2 className="text-sm font-terminal text-secondary uppercase tracking-wider mb-3">
            Documents
          </h2>
          <div className="grid gap-2">
            {docs.map((d) => (
              <button
                key={d.route}
                onClick={() => onNavigate(d.route)}
                className="text-left p-3 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                data-testid={`listing-doc-${d.slug}`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-display font-bold group-hover:text-primary transition-colors">
                    {d.title}
                  </span>
                </div>
                {d.summary && (
                  <p className="text-muted-foreground text-sm mt-1 ml-6">
                    {d.summary}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SystemsArchivePage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const [drawerTop, setDrawerTop] = useState(0);

    const currentRoute = location === "/systems" || location === "/systems/"
    ? "/systems"
    : location.replace(/\/$/, "");

  const { data: serverTree, isLoading, error } = useQuery({
    queryKey: ["/api/systems/tree"],
    queryFn: async () => {
      const res = await fetch("/api/systems/tree");
      if (!res.ok) throw new Error("Failed to fetch systems tree");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const processed = useMemo(() => {
    if (!serverTree) return null;
    return processTree(serverTree);
  }, [serverTree]);

  const tree = processed?.tree;
  const routeMap = processed?.routeMap;
  const folderRouteMap = processed?.folderRouteMap;
  const allDocs = useMemo(() => processed?.allDocs || [], [processed]);

  const currentDoc = useMemo(
    () => (routeMap ? getDocByRoute(routeMap, currentRoute) : undefined),
    [routeMap, currentRoute]
  );

  const indexDoc = useMemo(
    () => (routeMap ? getDocByRoute(routeMap, "/systems") : undefined),
    [routeMap]
  );

  const [searchResults, setSearchResults] = useState<DocNode[]>([]);

  const handleNavigate = useCallback(
    (route: string) => {
      setLocation(route);
      setSearchQuery("");
      setShowSearch(false);
      setSidebarOpen(false);
    },
    [setLocation]
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchDocs(allDocs, searchQuery));
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  }, [searchQuery, allDocs]);

    useEffect(() => {
        const update = () => {
            const el = headerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            setDrawerTop(Math.round(rect.bottom));
        };

        update();
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, { passive: true });

        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update);
        };
    }, []);

    useEffect(() => {
        if (!sidebarOpen) return;

        const el = headerRef.current;
        if (!el) return;

        // Run after React commits + the drawer toggle causes layout changes
        requestAnimationFrame(() => {
            const rect = el.getBoundingClientRect();
            setDrawerTop(Math.round(rect.bottom));
        });
    }, [sidebarOpen]);

    if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <span className="ml-3 font-terminal text-muted-foreground text-sm">LOADING_SYSTEMS_ARCHIVE...</span>
      </div>
    );
  }

  if (error || !tree) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="font-terminal text-destructive text-sm">ERROR: SYSTEMS_ARCHIVE_UNAVAILABLE</span>
      </div>
    );
  }

  const renderContent = () => {
    if (showSearch && searchResults.length > 0) {
      return (
        <div>
          <h2 className="text-sm font-terminal text-secondary uppercase tracking-wider mb-3">
            Search Results ({searchResults.length})
          </h2>
          <div className="grid gap-2">
            {searchResults.map((doc) => (
              <button
                key={doc.route}
                onClick={() => handleNavigate(doc.route)}
                className="text-left p-3 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <span className="font-display font-bold group-hover:text-primary transition-colors">
                  {doc.title}
                </span>
                {doc.summary && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {doc.summary}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (showSearch && searchQuery.trim()) {
      return (
        <div className="text-center py-12">
          <p className="font-terminal text-muted-foreground">
            NO_RESULTS: "{searchQuery}"
          </p>
        </div>
      );
    }

    if (currentDoc) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDoc.route}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <DocViewer doc={currentDoc} allDocs={allDocs} onNavigate={handleNavigate} />
          </motion.div>
        </AnimatePresence>
      );
    }

    if (folderRouteMap) {
      const folderNode = getFolderByRoute(folderRouteMap, currentRoute);
      if (folderNode) {
        const folderIndex = folderNode.children?.find((c) => c.isIndex);
        if (folderIndex) {
          return (
            <AnimatePresence mode="wait">
              <motion.div
                key={folderIndex.route}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <DocViewer doc={folderIndex} allDocs={allDocs} onNavigate={handleNavigate} />
              </motion.div>
            </AnimatePresence>
          );
        }
        return <FolderListing node={folderNode} onNavigate={handleNavigate} />;
      }
    }

    if (indexDoc) {
      return <DocViewer doc={indexDoc} allDocs={allDocs} onNavigate={handleNavigate} />;
    }

    return (
      <div className="text-center py-12">
        <p className="font-terminal text-muted-foreground">
          DOC_NOT_FOUND: {currentRoute}
        </p>
      </div>
    );
  };

  return (
    <div className="systems-archive -m-6 md:-m-12 flex flex-col" style={{ height: "calc(100vh - 3.5rem)" }}>
        <div
            ref={headerRef}
            className="h-12 border-b border-border bg-card/30 backdrop-blur-sm px-4 flex items-center justify-between gap-4 shrink-0"
        >
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="md:hidden font-terminal text-xs text-muted-foreground border border-border px-2 py-1 hover:text-primary hover:border-primary/50 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="sidebar-toggle"
          >
            TREE
          </button>
          <Breadcrumbs route={currentRoute} />
        </div>

        <div className="relative flex items-center shrink-0">
          <Search className="absolute left-2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH..."
            className="bg-black/30 border border-border text-sm font-terminal text-foreground placeholder:text-muted-foreground pl-7 pr-7 py-1 w-32 md:w-48 focus:outline-none focus:border-primary/50 transition-colors"
            data-testid="systems-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                searchRef.current?.focus();
              }}
              className="absolute right-2 text-muted-foreground hover:text-foreground"
              data-testid="search-clear"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.button
                        aria-label="Close sidebar"
                        onClick={() => setSidebarOpen(false)}
                        className="fixed left-0 right-0 bottom-0 z-30 bg-black/50 md:hidden"
                        style={{ top: drawerTop }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </AnimatePresence>

            <aside
                className={[
                    "systems-tree-sidebar border-r border-border bg-card/20 backdrop-blur-sm overflow-y-auto",
                    "md:relative md:translate-x-0 md:w-56 md:shrink-0 md:z-auto",
                    "fixed md:static z-40 left-0 w-64 bottom-0",
                    "transition-transform duration-300 ease-out will-change-transform",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                ].join(" ")}
                style={{ top: drawerTop }}
            >

            {/* Mobile drawer header */}
                <div className="md:hidden sticky top-0 z-10 border-b border-border bg-card/60 backdrop-blur-sm px-3 py-2 flex items-center justify-between">
      <span className="font-terminal text-[10px] text-muted-foreground uppercase tracking-widest">
        Archive Tree
      </span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="font-terminal text-xs text-muted-foreground border border-border px-2 py-1 hover:text-primary hover:border-primary/50 transition-colors"
                        aria-label="Close tree"
                        data-testid="sidebar-close"
                    >
                        CLOSE
                    </button>
                </div>

                {/* Tree content */}
                <div className="py-2">
                    <div className="hidden md:block px-3 py-2 mb-1">
                        <span className="font-terminal text-[10px] text-muted-foreground uppercase tracking-widest">
                            Archive Tree
                        </span>
                    </div>

                    <button
                        onClick={() => handleNavigate("/systems")}
                        className={`tree-item w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm font-terminal transition-all duration-200 ${
                            currentRoute === "/systems"
                                ? "text-primary bg-primary/10 border-l-2 border-primary tree-item-active"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5 border-l-2 border-transparent"
                        }`}
                        data-testid="tree-root"
                    >
                        <FolderOpen className="w-3.5 h-3.5 shrink-0 text-secondary opacity-70" />
                        <span className="truncate">Systems Index</span>
                    </button>

                    {getVisibleChildren(tree).map((child) => (
                        <TreeNode
                            key={child.route}
                            node={child}
                            currentRoute={currentRoute}
                            onNavigate={handleNavigate}
                            depth={1}
                        />
                    ))}
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-6 md:p-8 min-w-0">
                <div className="max-w-3xl mx-auto">{renderContent()}</div>
            </main>
        </div>
    </div>
  );
}
