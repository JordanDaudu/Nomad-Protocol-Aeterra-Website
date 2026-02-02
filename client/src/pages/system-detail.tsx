import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchSystemById, fetchSystems } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { audioManager } from "@/lib/AudioManager";

const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];

function isVideoUrl(src: string): boolean {
  const lowercaseSrc = src.toLowerCase();
  return videoExtensions.some(ext => lowercaseSrc.endsWith(ext));
}

const markdownComponents = {
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
  }
};

export default function SystemDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  
  const { data: system, isLoading } = useQuery({
    queryKey: ['system', params.id],
    queryFn: () => fetchSystemById(params.id)
  });

  const { data: allSystems } = useQuery({
    queryKey: ['systems'],
    queryFn: fetchSystems
  });

  useEffect(() => {
    if (system?.ost) {
      audioManager.setTrackById(system.ost);
    }
  }, [system?.ost]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <p className="font-terminal text-muted-foreground">Loading system data...</p>
      </div>
    );
  }

  if (!system) {
    return (
      <div className="space-y-6">
        <h1 className="text-destructive font-bold text-2xl font-terminal">ERROR 404: SYSTEM NOT FOUND</h1>
        <Button onClick={() => setLocation("/systems")} variant="outline" className="font-terminal">
          <ArrowLeft className="mr-2 h-4 w-4" /> RETURN_INDEX
        </Button>
      </div>
    );
  }

  const currentIndex = allSystems?.findIndex(s => s.id === system.id) ?? -1;
  const prevSystem = currentIndex > 0 && allSystems ? allSystems[currentIndex - 1] : null;
  const nextSystem = currentIndex >= 0 && allSystems && currentIndex < allSystems.length - 1 ? allSystems[currentIndex + 1] : null;

  return (
    <div className="space-y-8 pb-20">
      <div className="border-b border-border pb-6">
        <Button 
          variant="link" 
          onClick={() => setLocation("/systems")} 
          className="pl-0 text-muted-foreground hover:text-terminal font-terminal mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> BACK TO SYSTEMS
        </Button>
        
        <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight mb-4 text-terminal-dark">
          {system.title}
        </h1>
        
        <div className="flex items-center gap-4 font-terminal text-sm text-muted-foreground">
          <span className="font-terminal text-xs rounded-none border border-emerald-500/30 text-emerald-500 bg-emerald-500/10 px-2 py-1">
            {/* This creates the clean 000 number and adds the title once */}
            SYS_{String(currentIndex).padStart(3, "0")} - {system.title}
          </span>
          <span>TYPE: DOCUMENTATION</span>
        </div>
      </div>

      <article className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {system.content}
        </ReactMarkdown>
      </article>

      {/* --- Bottom Navigation Section --- */}
      <div className="border-t border-border pt-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        {prevSystem ? (
          <Link href={`/systems/${prevSystem.id}`} data-testid={`prev-system-${prevSystem.id}`}>
            {/* UPDATE: Change hover:border-primary/50 to hover:border-terminal/50 and bg-primary to terminal */}
            <div className="group border border-border p-4 cursor-pointer hover:border-terminal/50 hover:bg-terminal/5 transition-all text-left">
              <span className="block font-terminal text-xs text-muted-foreground mb-1">&lt; PREVIOUS</span>
              {/* UPDATE: Change group-hover:text-primary to group-hover:text-terminal */}
              <span className="font-display font-bold group-hover:text-terminal">{prevSystem.title}</span>
            </div>
          </Link>
        ) : <div />}

        {nextSystem ? (
          <Link href={`/systems/${nextSystem.id}`} data-testid={`next-system-${nextSystem.id}`}>
            {/* UPDATE: Change hover colors here too */}
            <div className="group border border-border p-4 cursor-pointer hover:border-terminal/50 hover:bg-terminal/5 transition-all text-right">
              <span className="block font-terminal text-xs text-muted-foreground mb-1">NEXT &gt;</span>
              <span className="font-display font-bold group-hover:text-terminal">{nextSystem.title}</span>
            </div>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
