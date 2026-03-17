import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import AudioPlayer from "@/components/audio-player";
import AmbientSystemBackground from "@/components/AmbientSystemBackground";
import { Home, FileText, Cpu, BookOpen, Image, Menu, X } from "lucide-react";

const NAV_ITEMS = [
    { path: "/", label: "HOME", code: "SYS.BOOT", icon: Home },
    { path: "/devlogs", label: "DEVLOGS", code: "LOG.READ", icon: FileText },
    { path: "/systems", label: "SYSTEMS", code: "SYS.DOC", icon: Cpu },
    { path: "/lore", label: "ARCHIVES", code: "DAT.LORE", icon: BookOpen },
    { path: "/gallery", label: "VISUALS", code: "IMG.VIEW", icon: Image },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const [location] = useLocation();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-white">
            <AmbientSystemBackground />
            <div className="scanlines z-50 pointer-events-none fixed inset-0" />

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
                        <span className="text-muted-foreground hidden sm:inline">
              {currentTime.toISOString().split('T')[0]} <span className="text-secondary">{currentTime.toLocaleTimeString()}</span>
            </span>
                        <button
                            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            data-testid="button-mobile-menu"
                            aria-label="Toggle navigation"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row">
                {mobileOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-30 md:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}

                <aside
                    className={cn(
                        "hidden md:flex flex-col gap-6 border-r border-border bg-card/20 backdrop-blur-sm shrink-0 py-6 group/sidebar transition-all duration-300 ease-out w-16 hover:w-56 overflow-hidden"
                    )}
                >
                    <div className="px-4 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
                        <h1 className="font-display font-bold text-xl tracking-tighter text-foreground glitch-text whitespace-nowrap" data-text="NOMAD">
                            NOMAD
                        </h1>
                        <p className="font-terminal text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">PROTOCOL v4.0</p>
                    </div>

                    <nav className="flex flex-col gap-1 px-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
                            const Icon = item.icon;
                            return (
                                <Link key={item.path} href={item.path}>
                                    <div
                                        className={cn(
                                            "cursor-pointer flex items-center gap-3 px-3 py-2.5 border border-transparent transition-all hover:bg-white/5 whitespace-nowrap",
                                            isActive
                                                ? "border-primary/50 bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:border-white/20"
                                        )}
                                        data-testid={`nav-${item.label.toLowerCase()}`}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span className="font-display font-bold tracking-wide text-sm opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
                      {item.label}
                    </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto px-3 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
                        <div className="border border-border p-3 font-terminal text-[10px] text-muted-foreground space-y-2">
                            <div className="flex justify-between whitespace-nowrap">
                                <span>MEM_USAGE</span>
                                <span className="text-secondary">64%</span>
                            </div>
                            <div className="w-full bg-muted h-1">
                                <div className="bg-secondary h-full w-[64%]" />
                            </div>
                            <div className="flex justify-between pt-2 whitespace-nowrap">
                                <span>INTEGRITY</span>
                                <span className="text-destructive">32%</span>
                            </div>
                            <div className="w-full bg-muted h-1">
                                <div className="bg-destructive h-full w-[32%]" />
                            </div>
                        </div>
                    </div>
                </aside>

                <aside
                    className={cn(
                        "fixed top-14 left-0 bottom-0 z-30 w-64 border-r border-border bg-background/95 backdrop-blur-md p-6 flex flex-col gap-6 transition-transform duration-300 ease-out md:hidden",
                        mobileOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div>
                        <h1 className="font-display font-bold text-xl tracking-tighter text-foreground glitch-text" data-text="NOMAD">
                            NOMAD
                        </h1>
                        <p className="font-terminal text-[10px] text-muted-foreground mt-0.5">PROTOCOL v4.0</p>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
                            const Icon = item.icon;
                            return (
                                <Link key={item.path} href={item.path}>
                                    <div
                                        className={cn(
                                            "cursor-pointer flex items-center gap-3 p-3 border border-transparent transition-all hover:bg-white/5",
                                            isActive
                                                ? "border-primary/50 bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:border-white/20"
                                        )}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span className="font-display font-bold tracking-wide text-sm">{item.label}</span>
                                        <span className="font-terminal text-[10px] opacity-50 ml-auto">[{item.code}]</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto">
                        <div className="border border-border p-3 font-terminal text-[10px] text-muted-foreground space-y-2">
                            <div className="flex justify-between">
                                <span>MEM_USAGE</span>
                                <span className="text-secondary">64%</span>
                            </div>
                            <div className="w-full bg-muted h-1">
                                <div className="bg-secondary h-full w-[64%]" />
                            </div>
                            <div className="flex justify-between pt-2">
                                <span>INTEGRITY</span>
                                <span className="text-destructive">32%</span>
                            </div>
                            <div className="w-full bg-muted h-1">
                                <div className="bg-destructive h-full w-[32%]" />
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 overflow-x-hidden p-6 md:p-12 min-w-0">
                    <div className="max-w-4xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            <div className="md:hidden border-t border-border p-4 font-terminal text-[10px] text-muted-foreground text-center">
                NOMAD PROTOCOL // AETERRA // TERMINAL ACCESS
            </div>
        </div>
    );
}
