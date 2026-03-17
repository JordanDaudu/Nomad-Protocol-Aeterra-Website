import { Github, Linkedin } from "lucide-react";

const LINKS = [
  {
    label: "GITHUB",
    sublabel: "src_repositories",
    url: "https://github.com/JordanDaudu",
    icon: Github,
    color: "cyan",
  },
  {
    label: "LINKEDIN",
    sublabel: "architect_profile",
    url: "https://www.linkedin.com/in/jordan-daudu-cpp-python-java/",
    icon: Linkedin,
    color: "cyan",
  },
];

export default function HomeExternalLinks() {
  return (
    <section className="py-6 pb-12" data-testid="section-external-links">
      <div className="font-terminal text-[10px] text-muted-foreground/50 tracking-[0.3em] uppercase mb-4">
        ■ EXTERNAL_NODES // REMOTE_ENDPOINTS
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-border bg-black/20 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-200 p-5 flex items-center gap-4"
            data-testid={`link-external-${link.label.toLowerCase()}`}
          >
            <div className="shrink-0 border border-cyan-500/20 bg-cyan-500/5 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/40 p-3 transition-all">
              <link.icon className="w-5 h-5 text-cyan-500/60 group-hover:text-cyan-400 transition-colors" />
            </div>

            <div className="min-w-0">
              <div className="font-display font-bold text-sm text-foreground group-hover:text-cyan-300 transition-colors tracking-wide">
                {link.label}
              </div>
              <div className="font-terminal text-[9px] text-cyan-700 group-hover:text-cyan-500 transition-colors tracking-widest uppercase mt-0.5">
                // {link.sublabel}
              </div>
            </div>

            <div className="ml-auto font-terminal text-[9px] text-muted-foreground/30 group-hover:text-cyan-500/50 transition-colors">
              →
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
