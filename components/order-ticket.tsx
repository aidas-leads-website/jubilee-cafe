"use client";

import { useEffect, useRef, useState } from "react";
import { pickupSlots } from "@/lib/hours";
import { stage } from "@/lib/stage";
import { changeQty, clearTray, useTray } from "@/lib/tray";
import { money } from "@/lib/util";

export function OrderTicket() {
  const { items, qty, total } = useTray();
  const [slots, setSlots] = useState<string[]>([]);
  const [slot, setSlot] = useState("");
  const [who, setWho] = useState("");
  /* an error is remembered with the tray size it was raised at, so changing the tray clears it */
  const [error, setError] = useState<{ text: string; qty: number } | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const whoInput = useRef<HTMLInputElement>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const tick = () =>
      setSlots((prev) => {
        const next = pickupSlots();
        return next.join() === prev.join() ? prev : next;
      });
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!confirmation) return;
    doneHeading.current?.focus({ preventScroll: true });
    document.getElementById("order")?.scrollIntoView();
  }, [confirmation]);

  const pickup = slots.includes(slot) ? slot : (slots[0] ?? "");
  const message = error && error.qty === qty ? error.text : "";

  function placeOrder() {
    if (!qty) {
      setError({ text: "Add something to your tray first.", qty });
      return;
    }
    const name = who.trim();
    if (!name) {
      setError({ text: "Add a name so the counter knows whose order it is.", qty });
      whoInput.current?.focus();
      return;
    }
    const when = pickup.replace(/^(Today|Tomorrow)/, (day) => day.toLowerCase());
    setConfirmation(
      `On the live site, ${name}, your ${qty} ${qty === 1 ? "item" : "items"} (${money(total)}) ` +
        `would be waiting at the counter on Floor C, ${when}.`,
    );
    setError(null);
    clearTray();
    stage.burst();
  }

  return (
    <>
      <div className="ticket rise" hidden={confirmation !== null}>
        <p className="empty" hidden={qty > 0}>
          Your tray is empty. Add something from <a href="#today">the menu</a> and it lands here.
        </p>
        <ul className="items">
          {items.map((c) => (
            <li key={c.key}>
              <span className="nm">{c.name}</span>
              <span className="step">
                <button type="button" aria-label={`Remove one ${c.name}`} onClick={() => changeQty(c.key, -1)}>
                  &minus;
                </button>
                <output>{c.qty}</output>
                <button type="button" aria-label={`Add one ${c.name}`} onClick={() => changeQty(c.key, 1)}>
                  +
                </button>
              </span>
              <span className="price">{money(c.qty * c.price)}</span>
            </li>
          ))}
        </ul>
        <div className="sum" hidden={qty === 0}>
          <span>Subtotal</span>
          <span className="price">{money(total)}</span>
        </div>
        <div className="field">
          <label htmlFor="slot">Pickup time</label>
          <select id="slot" value={pickup} onChange={(e) => setSlot(e.target.value)}>
            {slots.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="who">Name for the order</label>
          <input
            ref={whoInput}
            id="who"
            type="text"
            autoComplete="name"
            maxLength={40}
            value={who}
            onChange={(e) => {
              setWho(e.target.value);
              setError(null);
            }}
          />
        </div>
        <button className="btn primary" type="button" onClick={placeOrder}>
          Place order
        </button>
        <p className="msg" role="status" aria-live="polite">
          {message}
        </p>
        <p className="fine">
          Preview only. Payment is not connected yet, so nothing is charged or sent to the cafe.
        </p>
      </div>

      <div className="ticket done" hidden={confirmation === null}>
        <h3 ref={doneHeading} tabIndex={-1}>
          Order placed
        </h3>
        <p>{confirmation}</p>
        <p className="fine">Preview only. Nothing was charged and the cafe has not received this order.</p>
        <button className="btn ghost" type="button" onClick={() => setConfirmation(null)}>
          Start a new tray
        </button>
      </div>
    </>
  );
}
