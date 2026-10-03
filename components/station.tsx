"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { clamp, cx, prefersReducedMotion } from "@/lib/util";

const StationContext = createContext(false);

/* True once the surrounding station has scrolled into view. */
export const useStationIn = () => useContext(StationContext);

type Props = { id: string; className?: string; children: ReactNode };

/* A page section. It gains the "in" class the first time it enters view, which
   releases the entrance transitions of everything inside it. */
export function Station({ id, className, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} className={cx(className, inView && "in")}>
      <StationContext value={inView}>{children}</StationContext>
    </section>
  );
}

/* Rolls a number up from zero, like a till display, when its station enters view.
   `format` must be a stable function. */
export function useCountUp<T extends HTMLElement>(
  value: number,
  format: (v: number) => string,
  duration: number,
) {
  const ref = useRef<T>(null);
  const inView = useStationIn();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || prefersReducedMotion()) return;
    const t0 = performance.now();
    let raf = requestAnimationFrame(function step(now) {
      const p = 1 - Math.pow(1 - clamp((now - t0) / duration), 3);
      el.textContent = format(value * p);
      if (p < 1) raf = requestAnimationFrame(step);
    });
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = format(value);
    };
  }, [inView, value, format, duration]);

  return ref;
}
