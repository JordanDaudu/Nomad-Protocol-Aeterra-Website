import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LoreEntry {
  id: string;
  title: string;
  category: string;
  summary: string;
  loreImage?: string;
}

export default function HomeLoreHighlight() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: loreEntries = [], isLoading } = useQuery<LoreEntry[]>({
    queryKey: ["lore"],
    queryFn: async () => {
      const res = await fetch("/data/lore.json");
      if (!res.ok) throw new Error("Failed to fetch lore");
      return res.json();
    },
  });

  const total = loreEntries.length;
  const current = loreEntries[currentIndex];

  const prev = () => setCurrentIndex((i) => (i - 1 + total) % total);
  const next = () => setCurrentIndex((i) => (i + 1) % total);

  if (isLoading) {
    return (
      <section className="py-6" data-testid="section-lore-highlight">
        <div className="font-terminal text-[10px] text-muted-foreground/50 tracking-[0.3em] uppercase mb-4">
          ■ LORE
        </div>
        <div className="border border-border bg-black/40 p-10 flex items-center justify-center">
          <span className="font-terminal text-xs text-muted-foreground/40 animate-pulse">LOADING ARCHIVES...</span>
        </div>
      </section>
    );
  }

  if (!current) {
    return (
      <section className="py-6" data-testid="section-lore-highlight">
        <div className="font-terminal text-[10px] text-muted-foreground/50 tracking-[0.3em] uppercase mb-4">
          ■ LORE
        </div>
        <div className="border border-border bg-black/40 p-10 flex items-center justify-center">
          <span className="font-terminal text-xs text-muted-foreground/40">NO ARCHIVE DATA AVAILABLE</span>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6" data-testid="section-lore-highlight">
      <div className="flex items-center gap-3 mb-1">
        <div className="font-terminal text-[10px] text-muted-foreground/50 tracking-[0.3em] uppercase">
          ■ LORE
        </div>
      </div>
      <div className="font-terminal text-[9px] text-primary/40 tracking-[0.2em] uppercase mb-6">
        ARCHIVES_STREAM ACTIVE
      </div>

      <div className="relative border border-border bg-black/40 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`,
          }}
        />

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="relative z-10 p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="font-terminal text-[9px] text-accent/50 tracking-widest uppercase mb-2">
                ■ {current.category.toUpperCase()}
              </div>

              <h2
                className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4 uppercase"
                data-testid="text-lore-title"
              >
                {current.title}
              </h2>

              <p className="font-terminal text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                {current.summary}
              </p>

              <Link href="/lore">
                <button
                  className="mt-6 border border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary font-terminal text-xs tracking-[0.15em] uppercase px-6 py-2.5 transition-all duration-200"
                  data-testid="button-open-archives"
                >
                  OPEN_ARCHIVES →
                </button>
              </Link>
            </div>

            <div className="hidden md:block w-px self-stretch bg-border/30" />

            <div className="flex flex-col items-center gap-4 md:items-end shrink-0 md:pt-4">
              <div className="relative w-32 h-32 md:w-40 md:h-40 border border-border/30 flex items-center justify-center overflow-hidden">
                {current.loreImage ? (
                  <img
                    src={current.loreImage}
                    alt={current.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                    data-testid="img-lore-feature"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <div className="absolute w-24 h-24 md:w-32 md:h-32 border border-primary/10 rounded-full" />
                    <div className="absolute w-16 h-16 md:w-20 md:h-20 border border-primary/5 rounded-full" />
                    <div className="absolute w-1 h-1 bg-primary/60 rounded-full animate-pulse" />
                  </>
                )}

                <div className="absolute inset-0 overflow-hidden opacity-20">
                  <div className="w-full h-px bg-primary/30 absolute top-1/2" />
                  <div className="h-full w-px bg-primary/30 absolute left-1/2" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={prev}
                  className="border border-border hover:border-primary/50 hover:bg-primary/10 p-2 transition-all"
                  data-testid="button-lore-prev"
                  aria-label="Previous lore entry"
                >
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>

                <div className="font-terminal text-xs text-muted-foreground tracking-widest">
                  {currentIndex + 1} / {total}
                </div>

                <button
                  onClick={next}
                  className="border border-border hover:border-primary/50 hover:bg-primary/10 p-2 transition-all"
                  data-testid="button-lore-next"
                  aria-label="Next lore entry"
                >
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="flex gap-1">
                {loreEntries.map((_, i) => (
                  <div
                    key={i}
                    className={`h-0.5 transition-all duration-300 ${
                      i === currentIndex
                        ? "w-6 bg-primary"
                        : "w-2 bg-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
