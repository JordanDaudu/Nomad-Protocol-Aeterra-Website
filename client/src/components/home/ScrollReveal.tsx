import { useEffect, useRef, useState, useCallback } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before this section begins its reveal */
  delay?: number;
  /** Enable staggered reveal for direct children */
  stagger?: boolean;
  /** Stagger delay between children in ms */
  staggerDelay?: number;
}

export default function ScrollReveal({
                                       children,
                                       className = "",
                                       delay = 0,
                                       stagger = false,
                                       staggerDelay = 80,
                                     }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setPrefersReduced(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const handleIntersection = useCallback(
      ([entry]: IntersectionObserverEntry[]) => {
        setIsVisible(entry.isIntersecting);
      },
      []
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.06,
      rootMargin: "0px 0px -40px 0px",
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersection, prefersReduced]);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
      <div
          ref={ref}
          className={`scroll-reveal ${isVisible ? "scroll-reveal--visible" : ""} ${className}`}
          style={{ transitionDelay: `${delay}ms` }}
          data-stagger={stagger ? "true" : undefined}
          data-stagger-delay={stagger ? staggerDelay : undefined}
      >
        {children}
      </div>
  );
}
