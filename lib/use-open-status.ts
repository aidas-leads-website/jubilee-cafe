import { useEffect, useState } from "react";
import { HOURS_LINE, openStatus, type OpenStatus } from "./hours";

/* Server render and first paint show the plain hours; the live status follows on the client. */
export function useOpenStatus(): OpenStatus {
  const [status, setStatus] = useState<OpenStatus>({ isOpen: false, text: HOURS_LINE });

  useEffect(() => {
    const tick = () =>
      setStatus((prev) => {
        const next = openStatus();
        return next.isOpen === prev.isOpen && next.text === prev.text ? prev : next;
      });
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return status;
}
