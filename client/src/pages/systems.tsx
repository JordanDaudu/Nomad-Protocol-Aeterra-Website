import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchSystems } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu } from "lucide-react";

export default function Systems() {
  const {
    data: systems,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["systems"],
    queryFn: fetchSystems,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1
            className="text-4xl font-display font-bold glitch-text"
            data-text="SYSTEMS"
          >
            SYSTEMS
          </h1>
          <p className="font-terminal text-muted-foreground border-l-2 border-primary pl-4">
            Loading system documentation...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1
            className="text-4xl font-display font-bold glitch-text"
            data-text="ERROR"
          >
            ERROR
          </h1>
          <p className="font-terminal text-destructive border-l-2 border-destructive pl-4">
            Failed to load systems. Documentation corrupted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1
          className="text-4xl font-display font-bold glitch-text"
          data-text="SYSTEMS"
        >
          SYSTEMS
        </h1>
        {/* Changed border-primary to border-terminal */}
        <p className="font-terminal text-muted-foreground border-l-2 border-terminal pl-4">
          Internal game systems documentation. Technical specifications for core
          mechanics.
        </p>
      </div>

      <div className="grid gap-6 min-w-0">
        {systems &&
          systems.map((system, index) => (
            <Link
              key={system.id}
              href={`/systems/${system.id}`}
              data-testid={`system-card-${system.id}`}
            >
              <Card className="bg-card/40 border-border hover:border-terminal/50 transition-all cursor-pointer group backdrop-blur-sm overflow-hidden relative w-full">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Cpu className="w-16 h-16" />
                </div>

                <CardHeader className="min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    {/* Changed secondary colors to emerald (Terminal Green) */}
                    <Badge
                      variant="outline"
                      className="font-terminal text-xs rounded-none border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                    >
                      SYS_{String(index).padStart(3, "0")}
                    </Badge>
                    <span className="font-terminal text-xs text-muted-foreground group-hover:text-terminal transition-colors">
                      READ_DOC &gt;
                    </span>
                  </div>
                  <CardTitle className="font-display text-2xl group-hover:text-terminal transition-colors break-words overflow-hidden">
                    {system.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2 font-mono text-sm leading-relaxed break-words overflow-hidden">
                    {system.summary}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}

        {systems && systems.length === 0 && (
          <div className="border border-border p-8 text-center">
            <p className="font-terminal text-muted-foreground">
              No system documentation found.
            </p>
            <p className="font-terminal text-xs text-muted-foreground mt-2">
              Add .md files to /content/systems/
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
