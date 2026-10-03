"use client";

import { TrayCount } from "./tray-count";
import { useTray } from "@/lib/tray";
import { money } from "@/lib/util";

/* Phones only: the "Order pickup" button fixed to the bottom of the screen. */
export function Dock() {
  const { qty, total } = useTray();
  return (
    <div className="dock">
      <a className="btn primary" href="#order">
        <span>Order pickup</span>
        <span>
          <span className="price">{qty ? money(total) : ""}</span> <TrayCount id="dock-count" />
        </span>
      </a>
    </div>
  );
}
