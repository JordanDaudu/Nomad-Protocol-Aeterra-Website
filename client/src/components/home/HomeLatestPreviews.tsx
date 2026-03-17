import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { FileText, Cpu, Image } from "lucide-react";

interface Devlog {
  id: string;
  title: string;
  date: string;
  summary: string;
  order: number;
}

interface SystemDoc {
  id: string;
  title: string;
  summary: string;
  order: number;
}

interface GalleryItem {
  id: string;
  filename: string;
  caption: string;
  type: string;
}

export default function HomeLatestPreviews() {
  const { data: devlogs = [] } = useQuery<Devlog[]>({
    queryKey: ["/api/devlogs"],
    queryFn: async () => {
      const res = await fetch("/api/devlogs");
      if (!res.ok) throw new Error("Failed to fetch devlogs");
      return res.json();
    },
  });

  const { data: systems = [] } = useQuery<SystemDoc[]>({
    queryKey: ["/api/systems"],
    queryFn: async () => {
      const res = await fetch("/api/systems");
      if (!res.ok) throw new Error("Failed to fetch systems");
      return res.json();
    },
  });

  const { data: gallery = [] } = useQuery<GalleryItem[]>({
    queryKey: ["/api/gallery"],
    queryFn: async () => {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery");
      return res.json();
    },
  });

  const latestDevlog = devlogs.length > 0 ? devlogs[devlogs.length - 1] : null;
  const latestSystem = systems.length > 0 ? systems[systems.length - 1] : null;
  const recentGallery = gallery.slice(0, 3);

  return (
    <section className="py-6" data-testid="section-latest-content">
      <div className="font-terminal text-[10px] text-muted-foreground/50 tracking-[0.3em] uppercase mb-4">
        ■ LATEST_TRANSMISSIONS // CONTENT_FEED
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border border-border bg-black/20 p-5 hover:border-primary/30 transition-colors group" data-testid="card-latest-devlog">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary/60" />
            <span className="font-terminal text-[9px] text-primary/50 tracking-[0.2em] uppercase">
              LATEST_DEVLOG
            </span>
          </div>
          {latestDevlog ? (
            <Link href={`/devlogs/${latestDevlog.id}`}>
              <div className="cursor-pointer">
                <h3 className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-2">
                  {latestDevlog.title}
                </h3>
                {latestDevlog.date && (
                  <div className="font-terminal text-[9px] text-muted-foreground/50 mb-2">
                    {latestDevlog.date}
                  </div>
                )}
                <p className="font-terminal text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {latestDevlog.summary}
                </p>
              </div>
            </Link>
          ) : (
            <p className="font-terminal text-xs text-muted-foreground/40">
              No devlogs available.
            </p>
          )}
        </div>

        <div className="border border-border bg-black/20 p-5 hover:border-secondary/30 transition-colors group" data-testid="card-latest-system">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-secondary/60" />
            <span className="font-terminal text-[9px] text-secondary/50 tracking-[0.2em] uppercase">
              LATEST_SYSTEM
            </span>
          </div>
          {latestSystem ? (
            <Link href="/systems">
              <div className="cursor-pointer">
                <h3 className="font-display font-bold text-sm text-foreground group-hover:text-secondary transition-colors mb-1 line-clamp-2">
                  {latestSystem.title}
                </h3>
                <p className="font-terminal text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {latestSystem.summary}
                </p>
              </div>
            </Link>
          ) : (
            <p className="font-terminal text-xs text-muted-foreground/40">
              No systems available.
            </p>
          )}
        </div>

        <div className="border border-border bg-black/20 p-5 hover:border-accent/30 transition-colors" data-testid="card-recent-visuals">
          <div className="flex items-center gap-2 mb-3">
            <Image className="w-4 h-4 text-accent/60" />
            <span className="font-terminal text-[9px] text-accent/50 tracking-[0.2em] uppercase">
              RECENT_VISUALS
            </span>
          </div>
          {recentGallery.length > 0 ? (
            <Link href="/gallery">
              <div className="cursor-pointer grid grid-cols-3 gap-2">
                {recentGallery.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square border border-border/50 bg-black/40 overflow-hidden"
                  >
                    <img
                      src={`/content/gallery/${item.filename}`}
                      alt={item.caption}
                      className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                      data-testid={`img-gallery-${item.id}`}
                    />
                  </div>
                ))}
              </div>
            </Link>
          ) : (
            <p className="font-terminal text-xs text-muted-foreground/40">
              No visuals available.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: "ACCESS_LOGS", path: "/devlogs" },
          { label: "OPEN_SYSTEMS", path: "/systems" },
          { label: "OPEN_ARCHIVES", path: "/lore" },
          { label: "VIEW_VISUALS", path: "/gallery" },
        ].map((item) => (
          <Link key={item.path} href={item.path}>
            <button
              className="w-full border border-border bg-black/20 hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-primary font-terminal text-[10px] tracking-[0.15em] uppercase py-2.5 transition-all duration-200"
              data-testid={`button-cta-${item.label.toLowerCase().replace(/_/g, "-")}`}
            >
              {item.label} →
            </button>
          </Link>
        ))}
      </div>
    </section>
  );
}
