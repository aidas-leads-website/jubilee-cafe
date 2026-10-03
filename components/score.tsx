"use client";

import { useCountUp } from "./station";
import { SITE } from "@/lib/site";

const oneDecimal = (v: number) => v.toFixed(1);

/* The Google rating, counting up when the reviews section enters view. */
export function Score() {
  const ref = useCountUp<HTMLDivElement>(SITE.rating.value, oneDecimal, 950);
  return (
    <div ref={ref} className="score" role="img" aria-label={`${SITE.rating.value} out of 5`}>
      {oneDecimal(SITE.rating.value)}
    </div>
  );
}
