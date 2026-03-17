import heroImg from "@assets/generated_images/dark_sci-fi_system_terminal_boot_background.png";

export default function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden border border-border group" data-testid="section-hero">
      <div className="relative aspect-[16/7] w-full">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src={heroImg}
          alt="System Boot"
          className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000 ease-out"
          data-testid="img-hero-bg"
        />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6">
          <div className="font-terminal text-[10px] md:text-xs text-primary/60 tracking-[0.4em] uppercase mb-4">
            NOMAD PROTOCOL
          </div>
          <h1
            className="text-5xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter mb-4 glitch-text mix-blend-screen text-white"
            data-text="AETERRA"
            data-testid="text-hero-title"
          >
            AETERRA
          </h1>
          <p className="font-terminal text-[10px] md:text-sm text-primary tracking-[0.2em] uppercase animate-pulse">
            System Initialization Complete
          </p>
        </div>

        <div className="absolute top-4 left-4 z-20 font-terminal text-[9px] text-muted-foreground/40 hidden md:block">
          coords: 88.291.11<br />
          sect: NULL
        </div>
        <div className="absolute top-4 right-4 z-20 font-terminal text-[9px] text-muted-foreground/40 hidden md:block">
          SYS.BOOT // v4.2.08
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 opacity-50">
        <span className="font-terminal text-[8px] text-muted-foreground tracking-[0.3em] uppercase">scroll</span>
        <div className="w-px h-4 bg-muted-foreground/30 animate-pulse" />
      </div>
    </section>
  );
}
