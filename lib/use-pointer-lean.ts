import { useEffect, useRef } from "react";
import { finePointer, prefersReducedMotion } from "./util";

/* x and y are the pointer's offset from the element's centre, each -0.5 to 0.5. */
type Lean = (x: number, y: number) => string;

/* Menu cards tilt toward the pointer in 3D. */
export const tilt: Lean = (x, y) =>
  `perspective(700px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;

/* Primary buttons lean toward the pointer. */
export const magnet: Lean = (x, y) => `translate(${(x * 8).toFixed(1)}px,${(y * 6).toFixed(1)}px)`;

/* Desktop only: no effect on touch devices or with reduced motion. */
export function usePointerLean<T extends HTMLElement>(lean: Lean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = lean((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
    };
    const leave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.style.transform = "";
    };
  }, [lean]);

  return ref;
}
