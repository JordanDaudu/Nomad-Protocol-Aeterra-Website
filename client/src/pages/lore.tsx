import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchLore } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Lore() {
  const { data: lore, isLoading, error } = useQuery({
    queryKey: ['lore'],
    queryFn: fetchLore
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold glitch-text" data-text="ARCHIVES">ARCHIVES</h1>
          <p className="font-terminal text-muted-foreground border-l-2 border-secondary pl-4">
            Loading archive data...
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
            Archive corruption detected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-bold glitch-text" data-text="ARCHIVES">ARCHIVES</h1>
        <p className="font-terminal text-muted-foreground border-l-2 border-secondary pl-4">
          Recovered world data. Fragmentation detected in some sectors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lore && lore.map((item) => (
          <Link key={item.id} href={`/lore/${item.id}`}>
            <Card className="h-full bg-card/40 border-border hover:border-secondary/50 transition-all cursor-pointer group backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-terminal text-xs text-secondary uppercase tracking-widest border-b border-secondary/20 pb-1">
                    {item.category}
                  </span>
                </div>
                <CardTitle className="font-display text-xl group-hover:text-secondary transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                   {item.summary}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
