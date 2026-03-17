import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    stagger?: boolean;
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

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) {
            setIsVisible(true);
            return;
        }

        const el = ref.current;
        if (!el) return;

        const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (isMobile) {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(el);
                    }
                } else {
                    setIsVisible(entry.isIntersecting);
                }
            },
            { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

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
