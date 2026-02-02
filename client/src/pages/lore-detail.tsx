import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { useQueryClient } from "@tanstack/react-query";
import remarkGfm from "remark-gfm";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchLoreById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];

function isVideoUrl(src: string): boolean {
  const lowercaseSrc = src.toLowerCase();
  return videoExtensions.some(ext => lowercaseSrc.endsWith(ext));
}

// 1.Images and Videos
const markdownComponents: Partial<Components> = {
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

  // 2. Href and Children'
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    if (!href) return null;

    const queryClient = useQueryClient();
    const [, setLocation] = useLocation();

    // Clean up the href to get the ID (e.g., "./The-Null-Blight" -> "The-Null-Blight")
    const loreId = href.replace("./", "");

    const handlePrefetch = () => {
      // Start fetching the data as soon as the user hovers
      queryClient.prefetchQuery({
        queryKey: ['lore', loreId],
        queryFn: () => fetchLoreById(loreId),
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      });
    };

    const handleNavigate = (e: React.MouseEvent) => {
      e.preventDefault(); // Stop page reload
      window.scrollTo(0, 0); // 1. Move the user to the top instantly
      setLocation(`/lore/${loreId}`); // 2. Change the URL
    };

    return (
      <a
        href={href}
        onMouseEnter={handlePrefetch} // PREFETCH ON HOVER
        onClick={handleNavigate}      // INSTANT NAVIGATE
        className="
          text-secondary
          font-terminal
          relative
          inline-block
          transition-all
          animate-glitch-hover
          cursor-pointer
          after:content-['']
          after:absolute after:left-0 after:-bottom-0.5
          after:w-full after:h-[1px]
          after:bg-secondary/30
          hover:after:bg-secondary
          hover:drop-shadow-[0_0_5px_rgba(180,120,255,0.4)]
        "
      >
        <span className="opacity-70 mr-1">⧉</span>
        {children}
      </a>
    );
  }
};

export default function LoreDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();

  const { data: item, isLoading } = useQuery({
    queryKey: ['lore', params.id],
    queryFn: () => fetchLoreById(params.id)
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <p className="font-terminal text-muted-foreground">Loading archive entry...</p>
      </div>
    );
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="border-b border-secondary/20 pb-6">
        <Button 
          variant="link" 
          onClick={() => setLocation("/lore")} 
          className="pl-0 text-muted-foreground hover:text-secondary font-terminal mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> RETURN_ARCHIVES
        </Button>

        <div className="flex items-center gap-3 mb-2">
           <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
           <span className="font-terminal text-sm text-secondary tracking-widest uppercase">
             CLASS: {item.category}
           </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight mb-4 text-foreground">
          {item.title}
        </h1>
      </div>

      <div className="relative">
         {/* Decorative corners */}
         <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-secondary/30"></div>
         <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-secondary/30"></div>
         <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-secondary/30"></div>
         <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-secondary/30"></div>

         <div className="bg-card/20 p-8 border border-border">
            <article className="prose prose-invert max-w-none prose-headings:text-secondary prose-a:text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {item.content}
                </ReactMarkdown>
            </article>
         </div>
      </div>
    </div>
  );
}