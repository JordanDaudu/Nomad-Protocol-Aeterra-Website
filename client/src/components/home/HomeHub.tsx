import { useState } from "react";
import { SYSTEM_ALERTS, ENGINE_SKILLS, SYSTEM_STATS } from "@/pages/home-site-manifest";
import bannerImg from "@assets/Nomad_Protocol_Aeterra_Banner_Higher_Quality.png";

export default function HomeHub() {
  const [activeTab, setActiveTab] = useState<"mission" | "engineering">("mission");

  return (
    <section className="py-6" data-testid="section-hub">
      <div className="relative w-full border border-border overflow-hidden mb-6">
        <img
          src={bannerImg}
          alt="Nomad Protocol Aeterra Banner"
          className="w-full h-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          data-testid="img-banner"
        />
      </div>

      <div className="font-terminal text-[10px] text-muted-foreground/50 tracking-[0.3em] uppercase mb-4">
        ■ SYSTEM_HUB // CORE_DATA
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-border bg-black/20 overflow-hidden flex flex-col">
          <div className="flex border-b border-border shrink-0">
            <button
              onClick={() => setActiveTab("mission")}
              className={`flex-1 py-3 px-4 text-left font-display font-bold text-sm md:text-base transition-all duration-300 hover:bg-white/5 ${
                activeTab === "mission"
                  ? "text-primary bg-primary/10 border-b-2 border-primary"
                  : "text-muted-foreground border-b-2 border-transparent"
              }`}
              data-testid="button-tab-mission"
            >
              <span className="mr-2 opacity-50">01 //</span>
              MISSION_STATEMENT
            </button>
            <button
              onClick={() => setActiveTab("engineering")}
              className={`flex-1 py-3 px-4 text-left font-display font-bold text-sm md:text-base transition-all duration-300 hover:bg-white/5 border-l border-border ${
                activeTab === "engineering"
                  ? "text-primary bg-primary/10 border-b-2 border-primary"
                  : "text-muted-foreground border-b-2 border-transparent"
              }`}
              data-testid="button-tab-engineering"
            >
              <span className="mr-2 opacity-50">02 //</span>
              ENGINEERING_FOCUS
            </button>
          </div>

          <div className="relative w-full overflow-hidden min-h-[280px]">
            <div
              className={`flex w-[200%] h-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                activeTab === "mission" ? "translate-x-0" : "-translate-x-1/2"
              }`}
            >
              <div className="w-1/2 p-6">
                <div className="space-y-4">
                  <div className="font-terminal text-[9px] text-accent/60 tracking-widest uppercase mb-2">
                    LOG.ENTRY // MISSION_BRIEF
                  </div>
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

              <div className="w-1/2 p-6">
                <div className="space-y-4">
                  <div className="font-terminal text-[9px] text-accent/60 tracking-widest uppercase mb-2">
                    LOG.ENTRY // ENGINEERING_BRIEF
                  </div>
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

        <aside className="border border-border bg-card/10 backdrop-blur-md flex flex-col overflow-hidden" data-testid="section-system-status">
          <div className="p-4 border-b border-border bg-primary/5">
            <h3 className="font-terminal text-[10px] text-primary mb-4 tracking-[0.3em] uppercase">
              SIM_INTEGRITY_INDEX
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-terminal text-muted-foreground uppercase">
                  <span>Reality_Stability</span>
                  <span className="text-accent animate-pulse">{SYSTEM_STATS.stability}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 relative overflow-hidden border border-white/5">
                  <div
                    className="absolute h-full bg-accent z-10 transition-all duration-1000"
                    style={{ width: SYSTEM_STATS.stability }}
                  />
                  <div
                    className="absolute h-full bg-white/40 animate-pulse z-20 shadow-[0_0_10px_white]"
                    style={{ width: SYSTEM_STATS.stability }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-terminal text-muted-foreground uppercase">
                  <span>Ark_Uplink_Sync</span>
                  <span className="text-primary">{SYSTEM_STATS.uplink}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 relative">
                  <div
                    className="absolute h-full bg-primary shadow-[0_0_8px_rgba(180,120,255,0.4)] transition-all duration-1000"
                    style={{ width: SYSTEM_STATS.uplink }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 flex-grow space-y-6 overflow-y-auto custom-scrollbar">
            <div>
              <h3 className="font-terminal text-[10px] text-muted-foreground mb-4 tracking-[0.3em] uppercase">
                ACTIVE_SYSTEM_NOTIFICATIONS
              </h3>
              <ul className="space-y-4 font-terminal text-[10px] leading-tight">
                {[...SYSTEM_ALERTS].reverse().map((alert) => (
                  <li key={alert.id} className="space-y-1 group">
                    <div
                      className={`flex items-center gap-2 ${
                        alert.type === "CRIT"
                          ? "text-destructive animate-status-flicker"
                          : alert.type === "WARN"
                          ? "text-accent"
                          : "text-primary"
                      }`}
                    >
                      <span
                        className={`px-1 py-0.5 font-bold border transition-colors ${
                          alert.type === "CRIT"
                            ? "bg-destructive/20 border-destructive/50"
                            : alert.type === "WARN"
                            ? "bg-accent/20 border-accent/50"
                            : "bg-primary/20 border-primary/50"
                        }`}
                      >
                        [{alert.type}]
                      </span>
                      {alert.type === "CRIT" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-ping" />
                      )}
                      {alert.type === "WARN" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_4px_rgba(234,179,8,0.5)]" />
                      )}
                    </div>
                    <p
                      className={`text-muted-foreground/80 pl-2 border-l transition-colors ${
                        alert.type === "CRIT"
                          ? "border-destructive/30"
                          : alert.type === "WARN"
                          ? "border-accent/30"
                          : "border-primary/30"
                      }`}
                    >
                      {alert.message}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 bg-black/40 border-t border-border">
            <h4 className="font-terminal text-[8px] text-muted-foreground/50 mb-3 tracking-widest uppercase text-center italic opacity-50">
              Engine_Manifest
            </h4>
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
    </section>
  );
}
