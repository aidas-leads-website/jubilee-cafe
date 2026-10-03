"use client";

import type { ReactNode } from "react";
import { magnet, usePointerLean } from "@/lib/use-pointer-lean";

type Props = { href: string; className?: string; children: ReactNode };

/* A link styled as a primary button that leans toward the pointer on desktop. */
export function MagneticLink({ href, className, children }: Props) {
  const ref = usePointerLean<HTMLAnchorElement>(magnet);
  return (
    <a ref={ref} className={className} href={href}>
      {children}
    </a>
  );
}
