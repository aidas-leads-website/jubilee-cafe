"use client";

import { useOpenStatus } from "@/lib/use-open-status";
import { cx } from "@/lib/util";

/* Open or closed right now, in Atlanta time. The dot pulses while open. */
export function OpenStatus({ className }: { className?: string }) {
  const { isOpen, text } = useOpenStatus();
  return (
    <span className={cx("status", className, isOpen && "open")}>
      <span className="dot" />
      <span>{text}</span>
    </span>
  );
}
