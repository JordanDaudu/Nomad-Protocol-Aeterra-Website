import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import AudioPlayer from "@/components/audio-player";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { path: "/", label: "HOME", code: "SYS.BOOT" },
    { path: "/devlogs", label: "DEVLOGS", code: "LOG.READ" },
    { path: "/systems", label: "SYSTEMS", code: "SYS.DOC" },
    { path: "/lore", label: "ARCHIVES", code: "DAT.LORE" },
    { path: "/gallery", label: "VISUALS", code: "IMG.VIEW" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-white">
      {/* Scanline overlay */}
      <div className="scanlines z-50 pointer-events-none fixed inset-0" />
      
      {/* Top System Bar */}
      <header className="border-b border-border bg-background/95 backdrop-blur z-40 sticky top-0">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between font-terminal text-xs md:text-sm tracking-wider">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="text-primary animate-pulse">●</span>
            <span>SYSTEM: AETERRA</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline text-accent">STATUS: DEGRADED</span>
          </div>
          <div className="flex items-center gap-4">
            <AudioPlayer />
            <span className="text-muted-foreground">
              {currentTime.toISOString().split('T')[0]} <span className="text-secondary">{currentTime.toLocaleTimeString()}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card/20 backdrop-blur-sm p-4 md:p-6 flex flex-col gap-8 shrink-0">
          <div className="hidden md:block">
             <h1 className="font-display font-bold text-2xl tracking-tighter text-foreground glitch-text" data-text="NOMAD">
              NOMAD
            </h1>
            <p className="font-terminal text-xs text-muted-foreground mt-1">PROTOCOL v4.0</p>
          </div>

          <nav className="flex flex-row md:flex-col gap-2 md:gap-4 overflow-x-auto md:overflow-visible pb-1 md:pb-0 scrollbar-none">
            {navItems.map((item) => {
              const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    className={cn(
                      "cursor-pointer group flex flex-col md:flex-row md:items-center justify-between p-2 md:p-3 border border-transparent transition-all hover:bg-white/5 min-w-[100px] md:min-w-0 text-center md:text-left rounded-sm md:rounded-none",
                      isActive 
                        ? "border-primary/50 bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:border-white/20"
                    )}
                  >
                    <span className="font-display font-bold tracking-wide text-xs md:text-base">{item.label}</span>
                    <span className="font-terminal text-[10px] opacity-50 group-hover:opacity-100 hidden md:inline-block">
                      [{item.code}]
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto hidden md:block">
             <div className="border border-border p-4 font-terminal text-[10px] text-muted-foreground space-y-2">
                <div className="flex justify-between">
                  <span>MEM_USAGE</span>
                  <span className="text-secondary">64%</span>
                </div>
                <div className="w-full bg-muted h-1">
                  <div className="bg-secondary h-full w-[64%]"></div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <span>INTEGRITY</span>
                  <span className="text-destructive">32%</span>
                </div>
                <div className="w-full bg-muted h-1">
                  <div className="bg-destructive h-full w-[32%]"></div>
                </div>
             </div>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-12 min-w-0">
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Footer Info */}
       <div className="md:hidden border-t border-border p-4 font-terminal text-[10px] text-muted-foreground text-center">
         NOMAD PROTOCOL // AETERRA // TERMINAL ACCESS
       </div>
    </div>
  );
}
