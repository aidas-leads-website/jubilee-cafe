import { useSyncExternalStore } from "react";

/* The tray is the cart. It lives outside React so it can be read from localStorage
   without a hydration mismatch, and is remembered on the device. */

export type TrayItem = { key: string; name: string; price: number; qty: number };

const STORAGE_KEY = "jc-tray";
const EMPTY: TrayItem[] = [];

let items: TrayItem[] | null = null;
const listeners = new Set<() => void>();

const isItem = (x: unknown): x is TrayItem => {
  const it = x as TrayItem | null;
  return (
    !!it &&
    typeof it.key === "string" &&
    typeof it.name === "string" &&
    typeof it.price === "number" &&
    typeof it.qty === "number" &&
    it.qty > 0
  );
};

function read(): TrayItem[] {
  if (items === null) {
    items = EMPTY;
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) items = saved.filter(isItem);
    } catch {}
  }
  return items;
}

function write(next: TrayItem[]) {
  items = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function addItem(item: Omit<TrayItem, "qty">) {
  const current = read();
  write(
    current.some((c) => c.key === item.key)
      ? current.map((c) => (c.key === item.key ? { ...c, qty: c.qty + 1 } : c))
      : [...current, { ...item, qty: 1 }],
  );
}

export function changeQty(key: string, delta: number) {
  write(
    read()
      .map((c) => (c.key === key ? { ...c, qty: c.qty + delta } : c))
      .filter((c) => c.qty > 0),
  );
}

export function clearTray() {
  write([]);
}

export function useTray() {
  const tray = useSyncExternalStore(subscribe, read, () => EMPTY);
  let qty = 0;
  let total = 0;
  for (const c of tray) {
    qty += c.qty;
    total += c.qty * c.price;
  }
  return { items: tray, qty, total };
}
