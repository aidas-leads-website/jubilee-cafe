"use client";

import { useCountUp } from "./station";
import { money } from "@/lib/util";

export function Price({ value }: { value: number }) {
  const ref = useCountUp<HTMLSpanElement>(value, money, 520);
  return (
    <span ref={ref} className="price">
      {money(value)}
    </span>
  );
}
