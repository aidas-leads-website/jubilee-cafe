"use client";

import { useEffect, useRef } from "react";
import { useStationIn } from "./station";
import { useOpenStatus } from "@/lib/use-open-status";
import { prefersReducedMotion } from "@/lib/util";

const COLS = 16;
const FLAPS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$:.-";

/* Split-flap "Today" board. The final text is always in the markup; the flaps
   only spin through other characters on their way to it. */
export function FlipBoard() {
  const { isOpen } = useOpenStatus();
  const inView = useStationIn();
  const board = useRef<HTMLDivElement>(null);

  const lines = [
    "SOUP OF THE DAY ",
    "12 OZ      $3.29",
    "16 OZ      $5.29",
    isOpen ? "ORDER BY 2:45 PM" : "7AM-3PM  MON-FRI",
  ];
  const text = useRef("");
  useEffect(() => {
    text.current = lines.join("");
  });

  /* Blank the flaps while the board is still faded out, so they have something to flip from. */
  useEffect(() => {
    const el = board.current;
    if (!el || prefersReducedMotion()) return;
    const cells = Array.from(el.querySelectorAll<HTMLElement>(".fc"));
    cells.forEach((c) => (c.style.color = "transparent"));
    return () => cells.forEach((c) => (c.style.color = ""));
  }, []);

  useEffect(() => {
    const el = board.current;
    if (!el || !inView || prefersReducedMotion()) return;
    const cells = Array.from(el.querySelectorAll<HTMLElement>(".fc"));
    const timers: ReturnType<typeof setTimeout>[] = [];
    cells.forEach((cell, i) => {
      if (text.current[i] === " ") {
        cell.style.color = "";
        return;
      }
      const flips = 3 + (i % 5);
      let k = 0;
      const tick = () => {
        k++;
        cell.style.color = "";
        cell.textContent = k >= flips ? text.current[i] : FLAPS[(i * 7 + k * 11) % FLAPS.length];
        cell.animate([{ transform: "rotateX(-88deg)" }, { transform: "none" }], {
          duration: 120,
          easing: "ease-out",
        });
        if (k < flips) timers.push(setTimeout(tick, 55));
      };
      timers.push(setTimeout(tick, (i % COLS) * 40 + Math.floor(i / COLS) * 130));
    });
    return () => {
      timers.forEach(clearTimeout);
      cells.forEach((cell, i) => {
        cell.style.color = "";
        cell.textContent = text.current[i];
      });
    };
  }, [inView]);

  return (
    <div
      ref={board}
      className="board rise"
      role="img"
      aria-label="Soup of the day. 12 ounce $3.29. 16 ounce $5.29."
    >
      {lines.map((line, row) => (
        <div className="frow" key={row}>
          {Array.from(line.padEnd(COLS), (char, col) => (
            <span className="fc" key={col}>
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
