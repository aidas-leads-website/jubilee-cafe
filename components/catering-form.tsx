"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

export function CateringForm() {
  const [message, setMessage] = useState("");

  return (
    <form
      className="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(`This preview does not send inquiries yet. For now, call ${SITE.phone}.`);
      }}
    >
      <div className="field">
        <label htmlFor="c-name">Your name</label>
        <input id="c-name" type="text" autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="c-co">Company</label>
        <input id="c-co" type="text" autoComplete="organization" />
      </div>
      <div className="field">
        <label htmlFor="c-date">Date</label>
        <input id="c-date" type="date" />
      </div>
      <div className="field">
        <label htmlFor="c-n">Headcount</label>
        <input id="c-n" type="number" min={1} inputMode="numeric" />
      </div>
      <div className="field full">
        <label htmlFor="c-notes">Anything else</label>
        <textarea id="c-notes" />
      </div>
      <div className="full">
        <button className="btn primary" type="submit">
          Send inquiry
        </button>
      </div>
      <p className="msg full" role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
