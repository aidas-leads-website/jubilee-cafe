import type { CSSProperties } from "react";

export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const money = (v: number) => "$" + v.toFixed(2);

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

/* Sets --i, which the .rise transitions use to stagger their delay. */
export const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

/* Browser-only checks: call these from effects and event handlers. */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
export const smallScreen = () =>
  window.matchMedia("(max-width: 860px)").matches;
