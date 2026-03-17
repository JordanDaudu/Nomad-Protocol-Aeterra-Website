import { useEffect, useRef, useCallback } from "react";

export default function AmbientSystemBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  const updateCSSVars = useCallback(() => {
    const m = mouseRef.current;
    const dx = m.targetX - m.x;
    const dy = m.targetY - m.y;

    if (Math.abs(dx) < 0.0005 && Math.abs(dy) < 0.0005) {
      m.x = m.targetX;
      m.y = m.targetY;
      activeRef.current = false;
      return;
    }

    m.x += dx * 0.04;
    m.y += dy * 0.04;

    if (containerRef.current) {
      containerRef.current.style.setProperty("--mouse-x", `${m.x * 100}%`);
      containerRef.current.style.setProperty("--mouse-y", `${m.y * 100}%`);
    }

    rafRef.current = requestAnimationFrame(updateCSSVars);
  }, []);

  const startLoop = useCallback(() => {
    if (!activeRef.current) {
      activeRef.current = true;
      rafRef.current = requestAnimationFrame(updateCSSVars);
    }
  }, [updateCSSVars]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReduced || isTouch) return;

    const onMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = e.clientY / window.innerHeight;
      startLoop();
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [startLoop]);

  return (
    <div
      ref={containerRef}
      className="ambient-bg"
      style={{
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="ambient-grid" />
      <div className="ambient-glow" />
      <div className="ambient-vignette" />

      <div className="ambient-side ambient-side-left">
        <span className="ambient-coord" style={{ top: "12%", left: "8px" }}>
          47.3812°N
        </span>
        <span className="ambient-coord" style={{ top: "13.5%", left: "8px" }}>
          8.5381°E
        </span>

        <svg className="ambient-arc" style={{ top: "28%" }} viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="24" />
          <circle cx="30" cy="30" r="16" />
          <line x1="30" y1="2" x2="30" y2="14" />
          <line x1="30" y1="46" x2="30" y2="58" />
        </svg>

        <span className="ambient-label" style={{ top: "50%" }}>
          SYS.NODE_04
        </span>

        <span className="ambient-dot" style={{ top: "62%", left: "20px" }} />
        <span className="ambient-dot" style={{ top: "62%", left: "32px" }} />
        <span className="ambient-dot" style={{ top: "62%", left: "44px" }} />

        <span className="ambient-coord" style={{ top: "75%", left: "8px" }}>
          SECTOR::04-A
        </span>

        <svg className="ambient-arc" style={{ top: "85%" }} viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="20" />
          <line x1="10" y1="30" x2="50" y2="30" />
          <line x1="30" y1="10" x2="30" y2="50" />
        </svg>
      </div>

      <div className="ambient-side ambient-side-right">
        <span className="ambient-coord" style={{ top: "10%", right: "8px" }}>
          INTEGRITY: 0.32
        </span>

        <svg className="ambient-arc ambient-arc-right" style={{ top: "22%" }} viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="24" />
          <circle cx="30" cy="30" r="12" />
          <circle cx="30" cy="30" r="2" />
        </svg>

        <span className="ambient-label" style={{ top: "42%", right: "8px", left: "auto" }}>
          TELEMETRY
        </span>

        <span className="ambient-coord" style={{ top: "45%", right: "8px" }}>
          ΔV: 0.003 m/s
        </span>

        <span className="ambient-dot" style={{ top: "56%", right: "20px" }} />
        <span className="ambient-dot" style={{ top: "56%", right: "32px" }} />

        <span className="ambient-coord" style={{ top: "68%", right: "8px" }}>
          MEM: 0x7FA2
        </span>

        <span className="ambient-coord" style={{ top: "80%", right: "8px" }}>
          UPLINK::ACTIVE
        </span>

        <svg className="ambient-arc ambient-arc-right" style={{ top: "88%" }} viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="18" />
          <line x1="12" y1="30" x2="48" y2="30" />
        </svg>
      </div>
    </div>
  );
}
