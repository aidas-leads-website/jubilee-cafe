"use client";

import { useEffect, useRef, useState } from "react";

/* The fixed 3D stage. The scene and three.js load after the page itself has loaded;
   if WebGL is missing or lost, a flat illustration of the full tray stands in. */
export function TrayStage() {
  const stageEl = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [flat, setFlat] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;

    const init = () => {
      import("@/lib/tray-scene")
        .then(({ createTrayScene }) => {
          if (cancelled || !stageEl.current || !canvas.current) return;
          dispose = createTrayScene({
            stageEl: stageEl.current,
            canvas: canvas.current,
            onFlat: () => setFlat(true),
          });
        })
        .catch(() => setFlat(true));
    };

    if (document.readyState === "complete") init();
    else window.addEventListener("load", init, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", init);
      dispose?.();
    };
  }, []);

  return (
    <div id="stage" ref={stageEl} className={flat ? "flat" : undefined} aria-hidden="true">
      <canvas ref={canvas} />
      <div className="fallback">
        <svg viewBox="0 0 520 400" role="presentation">
          <g stroke="var(--rail)" strokeWidth="8" strokeLinecap="round">
            <path d="M0 110H520M0 200H520M0 290H520" />
          </g>
          <rect x="50" y="60" width="420" height="280" rx="36" fill="#1F8079" />
          <rect x="66" y="76" width="388" height="248" rx="26" fill="#23928A" />
          <circle cx="140" cy="150" r="46" fill="#F4F1E6" />
          <circle cx="140" cy="150" r="36" fill="#D9622B" />
          <rect x="270" y="96" width="130" height="130" rx="14" fill="#E0B36A" />
          <rect x="286" y="112" width="98" height="98" rx="8" fill="#EBC788" />
          <circle cx="335" cy="161" r="8" fill="#6B8E23" />
          <g transform="rotate(-14 170 262)">
            <rect x="104" y="226" width="132" height="76" rx="12" fill="#C88A3A" />
            <path
              d="M124 240l22 48M150 240l22 48M176 240l22 48M202 240l18 40"
              stroke="#5A3414"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
          <circle cx="368" cy="272" r="48" fill="#F2A71B" />
          <circle cx="368" cy="272" r="37" fill="#6FB04A" />
          <circle cx="356" cy="262" r="7" fill="#D8432B" />
          <circle cx="382" cy="282" r="7" fill="#D8432B" />
          <circle cx="262" cy="282" r="24" fill="#C99556" />
          <circle cx="256" cy="276" r="3.5" fill="#4A2A14" />
          <circle cx="270" cy="286" r="3.5" fill="#4A2A14" />
          <circle cx="262" cy="292" r="3" fill="#4A2A14" />
        </svg>
      </div>
    </div>
  );
}
