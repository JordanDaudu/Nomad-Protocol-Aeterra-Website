import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchDevlogById, fetchDevlogs } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

export default function DevlogPost({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  
  const { data: log, isLoading } = useQuery({
    queryKey: ['devlog', params.id],
    queryFn: () => fetchDevlogById(params.id)
  });

  const { data: allDevlogs } = useQuery({
    queryKey: ['devlogs'],
    queryFn: fetchDevlogs
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <p className="font-terminal text-muted-foreground">Loading log data...</p>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="space-y-6">
        <h1 className="text-destructive font-bold text-2xl font-terminal">ERROR 404: LOG NOT FOUND</h1>
        <Button onClick={() => setLocation("/devlogs")} variant="outline" className="font-terminal">
          <ArrowLeft className="mr-2 h-4 w-4" /> RETURN_INDEX
        </Button>
      </div>
    );
  }

  // Find next/prev
  const currentIndex = allDevlogs?.findIndex(l => l.id === log.id) ?? -1;
  const prevLog = currentIndex > 0 && allDevlogs ? allDevlogs[currentIndex - 1] : null;
  const nextLog = currentIndex >= 0 && allDevlogs && currentIndex < allDevlogs.length - 1 ? allDevlogs[currentIndex + 1] : null;

  return (
    <div className="space-y-8 pb-20">
      <div className="border-b border-border pb-6">
        <Button 
          variant="link" 
          onClick={() => setLocation("/devlogs")} 
          className="pl-0 text-muted-foreground hover:text-primary font-terminal mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> BACK TO INDEX
        </Button>
        
        <h1 
          className="text-4xl md:text-5xl font-bold font-display tracking-tight mb-4"
          style={{ color: log.titleColor || 'var(--color-primary)' }}
        >
          {log.title}
        </h1>
        
        <div className="flex items-center gap-4 font-terminal text-sm text-muted-foreground">
           <span className="bg-primary/10 text-primary px-2 py-1 border border-primary/20">LOG_{log.id}</span>
           <span>DATE: {log.date}</span>
           <span>AUTHOR: ADMIN</span>
        </div>
      </div>

      <article className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {log.content}
        </ReactMarkdown>
      </article>

      <div className="border-t border-border pt-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        {prevLog ? (
           <Link href={`/devlogs/${prevLog.id}`}>
             <div className="group border border-border p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-left">
               <span className="block font-terminal text-xs text-muted-foreground mb-1">&lt; PREVIOUS</span>
               <span className="font-display font-bold group-hover:text-primary">{prevLog.title}</span>
             </div>
           </Link>
        ) : <div />}
        
        {nextLog ? (
           <Link href={`/devlogs/${nextLog.id}`}>
             <div className="group border border-border p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-right">
               <span className="block font-terminal text-xs text-muted-foreground mb-1">NEXT &gt;</span>
               <span className="font-display font-bold group-hover:text-primary">{nextLog.title}</span>
             </div>
           </Link>
        ) : <div />}
      </div>
    </div>
  );
}
