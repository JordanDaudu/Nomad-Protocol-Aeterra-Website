import { Link } from "wouter";

const NAV_ITEMS = [
  { label: "DEVLOGS", path: "/devlogs", prefix: "01" },
  { label: "SYSTEMS", path: "/systems", prefix: "02" },
  { label: "ARCHIVES", path: "/lore", prefix: "03" },
  { label: "VISUALS", path: "/gallery", prefix: "04" },
];

export default function HomeQuickAccess() {
  return (
    <section className="py-4" data-testid="section-quick-access">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {NAV_ITEMS.map((item) => (
          <Link key={item.path} href={item.path}>
            <button
              className="w-full border border-border bg-black/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 px-4 py-3 md:py-4 text-left group"
              data-testid={`link-nav-${item.label.toLowerCase()}`}
            >
              <span className="font-terminal text-[9px] text-muted-foreground/50 block mb-1">
                {item.prefix} //
              </span>
              <span className="font-display font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors tracking-wide">
                {item.label}
              </span>
              <span className="font-terminal text-[8px] text-primary/40 block mt-1 group-hover:text-primary/70 transition-colors">
                → NAVIGATE
              </span>
            </button>
          </Link>
        ))}
      </div>
    </section>
  );
}
