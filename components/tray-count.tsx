"use client";

import { useTray } from "@/lib/tray";

/* The id is how the add-to-tray dot finds where to land. */
export function TrayCount({ id }: { id: string }) {
  const { qty } = useTray();
  return (
    <span className="count" id={id}>
      {qty}
    </span>
  );
}
