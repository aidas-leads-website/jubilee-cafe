"use client";

import { Price } from "./price";
import { fly } from "@/lib/fly";
import { stage } from "@/lib/stage";
import { addItem } from "@/lib/tray";
import { money } from "@/lib/util";

type Props = {
  id: string;
  /* how the item reads on the tray, e.g. "Club sandwich" */
  name: string;
  price: number;
  /* short visible label, e.g. "Sandwich" */
  way?: string;
  showPrice?: boolean;
  /* spoken name, when it should differ from `name` */
  label?: string;
};

export function AddButton({ id, name, price, way, showPrice = true, label }: Props) {
  return (
    <button
      className="add"
      type="button"
      aria-label={`Add ${label ?? name}, ${money(price)}`}
      onClick={(e) => {
        addItem({ key: id, name, price });
        fly(e.currentTarget);
        stage.hop();
      }}
    >
      {way && <span className="way">{way}</span>}
      {showPrice && <Price value={price} />}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}
