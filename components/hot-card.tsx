"use client";

import { AddButton } from "./add-button";
import { Price } from "./price";
import type { HotItem } from "@/lib/menu";
import { tilt, usePointerLean } from "@/lib/use-pointer-lean";
import { stagger } from "@/lib/util";

export function HotCard({ item, index }: { item: HotItem; index: number }) {
  const ref = usePointerLean<HTMLElement>(tilt);
  return (
    <article ref={ref} className="card rise" style={stagger(index)}>
      <span className="kind">{item.kind}</span>
      <h3>{item.name}</h3>
      <p>{item.note}</p>
      <div className="foot">
        <Price value={item.price} />
        <AddButton
          id={item.id}
          name={item.kind === "Panini" ? `${item.name} panini` : item.name}
          label={item.name}
          price={item.price}
          way="Add"
          showPrice={false}
        />
      </div>
    </article>
  );
}
