import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchDevlogs } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Devlogs() {
  const { data: devlogs, isLoading, error } = useQuery({
    queryKey: ['devlogs'],
    queryFn: fetchDevlogs
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold glitch-text" data-text="DEVLOGS">DEVLOGS</h1>
          <p className="font-terminal text-muted-foreground border-l-2 border-primary pl-4">
            Loading system logs...
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
            Failed to load devlogs. System corrupted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-bold glitch-text" data-text="DEVLOGS">DEVLOGS</h1>
        <p className="font-terminal text-muted-foreground border-l-2 border-primary pl-4">
          Development logs recovered from the central mainframe. Chronological order.
        </p>
      </div>

      <div className="grid gap-6 min-w-0">
        {devlogs && devlogs.map((log) => (
          <Link key={log.id} href={`/devlogs/${log.id}`}>
            <Card className="bg-card/40 border-border hover:border-primary/50 transition-all cursor-pointer group backdrop-blur-sm overflow-hidden relative w-full">
               <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                 <span className="font-terminal text-6xl font-bold">{log.id.split('-')[0]}</span>
               </div>
               
              <CardHeader className="min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="font-terminal text-xs rounded-none border-primary/30 text-primary bg-primary/5">
                    {log.date}
                  </Badge>
                  <span className="font-terminal text-xs text-muted-foreground group-hover:text-secondary transition-colors">
                    ACCESS_LOG &gt;
                  </span>
                </div>
                <CardTitle className="font-display text-2xl group-hover:text-primary transition-colors break-words overflow-hidden">
                  {log.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 font-mono text-sm leading-relaxed break-words overflow-hidden">
                  {log.summary}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
