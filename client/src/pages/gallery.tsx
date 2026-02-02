import { useQuery } from "@tanstack/react-query";
import { fetchGallery } from "@/lib/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Gallery() {
  const { data: gallery, isLoading, error } = useQuery({
    queryKey: ['gallery'],
    queryFn: fetchGallery
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold glitch-text" data-text="VISUALS">VISUALS</h1>
          <p className="font-terminal text-muted-foreground border-l-2 border-accent pl-4">
            Loading visual data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold glitch-text" data-text="ERROR">ERROR</h1>
          <p className="font-terminal text-destructive border-l-2 border-destructive pl-4">
            Visual data corruption detected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-bold glitch-text" data-text="VISUALS">VISUALS</h1>
        <p className="font-terminal text-muted-foreground border-l-2 border-accent pl-4">
          Visual data dumps recovered from memory banks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gallery && gallery.map((item) => {
          const imageSrc = `/gallery-images/${item.filename}`;
          
          return (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <div className="group relative aspect-video bg-black border border-border hover:border-accent/50 cursor-zoom-in overflow-hidden">
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none mix-blend-overlay"></div>
                  
                  {item.type === "video" ? (
                    <video 
                      src={imageSrc}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                      muted
                      loop
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                  ) : (
                    <img 
                      src={imageSrc}
                      alt={item.caption}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                    />
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-2 border-t border-border translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-terminal text-xs text-accent truncate">{item.caption}</p>
                  </div>
                  
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/50"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/50"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/50"></div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/50"></div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-black/95 border-accent/20 p-1 text-accent">
                <div className="relative">
                  {item.type === "video" ? (
                    <video 
                      src={imageSrc}
                      className="w-full h-auto"
                      controls
                      autoPlay
                      loop
                    />
                  ) : (
                    <img 
                      src={imageSrc}
                      alt={item.caption}
                      className="w-full h-auto"
                    />
                  )}
                  <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 border border-accent/30 font-terminal text-sm">
                    {item.caption}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}
