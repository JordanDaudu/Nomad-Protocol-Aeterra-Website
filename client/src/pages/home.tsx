import { useState } from "react"; // Import useState
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImg from "@assets/generated_images/dark_sci-fi_system_terminal_boot_background.png";
import bannerImg from "@assets/Nomad_Protocol_Aeterra.png";
import { SYSTEM_ALERTS, ENGINE_SKILLS, SYSTEM_STATS } from "./home-site-manifest";

export default function Home() {
  // Create state to track the active view ('mission' or 'engineering')
  const [activeTab, setActiveTab] = useState<'mission' | 'engineering'>('mission');

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative aspect-[16/7] w-full overflow-hidden border border-border group">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src={heroImg} 
          alt="System Boot" 
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 ease-out"
        />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6">
           <h1 className="text-4xl md:text-7xl font-display font-bold tracking-tighter mb-4 glitch-text mix-blend-screen text-white" data-text="AETERRA">
             AETERRA
           </h1>
           <p className="font-terminal text-xs md:text-base text-primary tracking-[0.2em] uppercase animate-pulse">
             System Initialization Complete
           </p>
        </div>

        {/* Decorative HUD Elements */}
        <div className="absolute top-4 left-4 z-20 font-terminal text-[10px] text-muted-foreground/50">
           coords: 88.291.11<br/>
           sect: NULL
        </div>
      </div>

      {/* Intro Grid */}
      {/* Added 'items-stretch' so both columns are equal height */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

         {/* Left Column: Changed to flex column with h-full so we can push buttons to bottom */}
         <div className="col-span-1 md:col-span-2 flex flex-col gap-6 h-full">

           {/* Banner Image: Added shrink-0 so it doesn't get squashed */}
           <div className="relative w-full border border-border overflow-hidden shrink-0">
             <img src={bannerImg} alt="Nomad Protocol Banner" className="w-full h-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
           </div>

           {/* --- START: SLIDING CONTENT SYSTEM --- */}
           {/* Added flex-1 to make this box grow to fill empty space */}
           <div className="border border-border bg-black/20 overflow-hidden flex-1 flex flex-col">

             {/* 3. The Control Tabs */}
             <div className="flex border-b border-border shrink-0">
               <button 
                 onClick={() => setActiveTab('mission')}
                 className={`flex-1 py-3 px-4 text-left font-display font-bold text-sm md:text-lg transition-all duration-300 hover:bg-white/5 ${
                   activeTab === 'mission' 
                     ? 'text-primary bg-primary/10 border-b-2 border-primary' 
                     : 'text-muted-foreground border-b-2 border-transparent'
                 }`}
               >
                 <span className="mr-2 opacity-50">01 //</span> 
                 MISSION_STATEMENT
               </button>
               <button 
                 onClick={() => setActiveTab('engineering')}
                 className={`flex-1 py-3 px-4 text-left font-display font-bold text-sm md:text-lg transition-all duration-300 hover:bg-white/5 border-l border-border ${
                   activeTab === 'engineering' 
                     ? 'text-primary bg-primary/10 border-b-2 border-primary' 
                     : 'text-muted-foreground border-b-2 border-transparent'
                 }`}
               >
                 <span className="mr-2 opacity-50">02 //</span> 
                 ENGINEERING_FOCUS
               </button>
             </div>

             {/* 4. The Sliding Container */}
             {/* We make the inner width 200% and slide it left/right based on state */}
             {/* Added h-full to ensure inner content stretches */}
             <div className="relative w-full overflow-hidden h-full">
                <div 
                  className={`flex w-[200%] h-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    activeTab === 'mission' ? 'translate-x-0' : '-translate-x-1/2'
                  }`}
                >

                  {/* PANEL 1: MISSION */}
                  <div className="w-1/2 p-6">
                    <div className="prose prose-invert max-w-none">
                      <p className="font-terminal text-sm leading-relaxed text-muted-foreground">
                        Nomad Protocol is set inside the AETERRA System — a planetary-scale reality layer originally designed to terraform Earth using self-replicating nanites. After a fatal logic fracture, the system no longer repairs the world. It compiles it.
                      </p>
                      <p className="font-terminal text-sm leading-relaxed text-muted-foreground">
                        Physical matter is now processed as corrupted data. Terrain regenerates unpredictably. Entire sectors are periodically dissolved and recompiled through automated Refresh Cycles.
                      </p>
                      <p className="font-terminal text-sm leading-relaxed text-muted-foreground">
                        You operate as a Model-7 Nomad Maintenance Frame — a pre-collapse service unit carrying a fragment of clean system code. The world cannot fully resolve your existence. You are an error it cannot safely delete.
                      </p>
                      <p className="font-terminal text-sm leading-relaxed text-muted-foreground">
                        Your directive is not to save the planet. It is already archived. Your function is to recover legacy data fragments and transmit them to the Orbital Ark before each sector is formatted.
                      </p>
                    </div>
                  </div>

                  {/* PANEL 2: ENGINEERING */}
                  <div className="w-1/2 p-6">
                    <div className="prose prose-invert max-w-none">
                      <p className="font-terminal text-sm leading-relaxed text-muted-foreground">
                        Beyond its fiction, Nomad Protocol is developed as an engineering-first project. The game functions as a controlled environment for designing and validating scalable gameplay architecture.
                      </p>
                      <p className="font-terminal text-sm leading-relaxed text-muted-foreground">
                        Systems are built as independent, cooperating modules rather than monolithic feature scripts. Core development emphasizes decoupling, data-driven workflows, animation-gameplay separation, and long-term extensibility.
                      </p>
                      <p className="font-terminal text-sm leading-relaxed text-muted-foreground">
                        The project documents the design and evolution of core gameplay and technical systems, with an emphasis on modular architecture, systemic interaction, and performance-oriented foundations.
                      </p>
                      <p className="font-terminal text-sm leading-relaxed text-muted-foreground">
                        Each devlog serves as a technical breakdown — detailing system responsibilities, architectural decisions, encountered problems, and the engineering rationale behind their solutions.
                      </p>
                    </div>
                  </div>

                </div>
             </div>
           </div>
           {/* --- END: SLIDING CONTENT SYSTEM --- */}

           {/* Buttons */}
           {/* Added mt-auto to push buttons to the bottom of the flex container */}
           <div className="flex gap-4 pt-0 mt-auto shrink-0">
             <Link href="/devlogs">
               <Button className="rounded-none font-terminal bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50">
                 ACCESS_LOGS
               </Button>
             </Link>
             <Link href="/gallery">
               <Button variant="outline" className="rounded-none font-terminal border-border hover:bg-white/5">
                 VIEW_MEDIA
               </Button>
             </Link>
           </div>
         </div>

        {/* System Alerts Sidebar */}
        <aside className="col-span-1 border border-border bg-card/10 backdrop-blur-md flex flex-col h-full overflow-hidden">

          {/* TOP: LIVE SIMULATION STATUS */}
          <div className="p-4 border-b border-border bg-primary/5">
            <h3 className="font-terminal text-[10px] text-primary mb-4 tracking-[0.3em] uppercase">
              SIM_INTEGRITY_INDEX
            </h3>
            <div className="space-y-4">
              {/* Reality Stability with high-visibility Ghost Pulse */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-terminal text-muted-foreground uppercase">
                  <span>Reality_Stability</span>
                  <span className="text-accent animate-pulse">{SYSTEM_STATS.stability}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 relative overflow-hidden border border-white/5">
                  {/* Main Progress Bar */}
                  <div 
                    className="absolute h-full bg-accent z-10 transition-all duration-1000" 
                    style={{ width: SYSTEM_STATS.stability }}
                  ></div>
                  {/* The Pulse */}
                  <div 
                    className="absolute h-full bg-white/40 animate-pulse z-20 shadow-[0_0_10px_white]" 
                    style={{ width: SYSTEM_STATS.stability }}
                  ></div>
                </div>
              </div>

              {/* Ark Uplink with Sync Glow */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-terminal text-muted-foreground uppercase">
                  <span>Ark_Uplink_Sync</span>
                  <span className="text-primary">{SYSTEM_STATS.uplink}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 relative">
                  <div 
                    className="absolute h-full bg-primary shadow-[0_0_8px_rgba(180,120,255,0.4)] transition-all duration-1000" 
                    style={{ width: SYSTEM_STATS.uplink }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE: THE ALERTS & LOGS */}
          <div className="p-4 flex-grow space-y-6 overflow-y-auto custom-scrollbar">
            <div>
              <h3 className="font-terminal text-[10px] text-muted-foreground mb-4 tracking-[0.3em] uppercase">
                ACTIVE_SYSTEM_NOTIFICATIONS
              </h3>
              <ul className="space-y-4 font-terminal text-[10px] leading-tight">

                {/* We map the array reversed so newest items (at the bottom of the file) appear at the top */}
                {[...SYSTEM_ALERTS].reverse().map((alert) => (
                  <li key={alert.id} className="space-y-1 group">
                    <div className={`flex items-center gap-2 ${
                      alert.type === 'CRIT' ? 'text-destructive animate-status-flicker' : 
                      alert.type === 'WARN' ? 'text-accent' : 'text-primary'
                    }`}>
                      <span className={`px-1 py-0.5 font-bold border transition-colors ${
                        alert.type === 'CRIT' ? 'bg-destructive/20 border-destructive/50' : 
                        alert.type === 'WARN' ? 'bg-accent/20 border-accent/50' : 
                        'bg-primary/20 border-primary/50'
                      }`}>
                        [{alert.type}]
                      </span>

                      {/* Critical: Red Blinking LED */}
                      {alert.type === 'CRIT' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-ping"></span>
                      )}

                      {/* Warning: Yellow Solid LED (Matches text-accent color) */}
                      {alert.type === 'WARN' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_4px_rgba(234,179,8,0.5)]"></span>
                      )}
                    </div>
                    <p className={`text-muted-foreground/80 pl-2 border-l transition-colors ${
                        alert.type === 'CRIT' ? 'border-destructive/30' : 
                        alert.type === 'WARN' ? 'border-accent/30' : 
                        'border-primary/30'
                    }`}>
                      {alert.message}
                    </p>
                  </li>
                ))}

                {/* EXTERNAL LINKS SECTION - Refined for better visibility */}
                <li className="pt-4 space-y-3 border-t border-white/10">
                  <a 
                    href="https://github.com/JordanDaudu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="bg-cyan-500/10 px-1 py-0.5 border border-cyan-500/40 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-200 transition-all uppercase font-bold">
                        Github
                      </span>
                      <span className="text-[8px] text-cyan-700 group-hover:text-cyan-400 transition-colors uppercase tracking-widest">
                        → src_repositories
                      </span>
                    </div>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/jordan-daudu-cpp-python-java/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="bg-cyan-500/10 px-1 py-0.5 border border-cyan-500/40 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-200 transition-all uppercase font-bold">
                        Linkedin
                      </span>
                      <span className="text-[8px] text-cyan-700 group-hover:text-cyan-400 transition-colors uppercase tracking-widest">
                        → architect_profile
                      </span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* BOTTOM: SKILLS */}
          <div className="p-4 bg-black/40 border-t border-border">
            <h4 className="font-terminal text-[8px] text-muted-foreground/50 mb-3 tracking-widest uppercase text-center italic opacity-50">Engine_Manifest</h4>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {ENGINE_SKILLS.map((skill) => (
                <div 
                  key={skill} 
                  className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-[8px] font-terminal text-muted-foreground hover:border-primary/50 hover:text-primary transition-all cursor-default"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}