/* Open status and pickup slots, always in Atlanta time. Minutes are counted from midnight. */

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const OPEN = 7 * 60;
const CLOSE = 15 * 60;
const LAST_SLOT = 14 * 60 + 45;
const SLOT_STEP = 15;

export const HOURS_LINE = "Mon to Fri, 7:00 am to 3:00 pm";

type Now = { wd: number; mins: number };

export function atlantaNow(): Now {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).formatToParts(new Date());
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return {
      wd: SHORT_DAYS.indexOf(get("weekday")),
      mins: (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10),
    };
  } catch {
    const d = new Date();
    return { wd: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
  }
}

function clock(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h % 12 || 12}:${m < 10 ? "0" : ""}${m} ${h >= 12 ? "pm" : "am"}`;
}

const isWeekday = (wd: number) => wd >= 1 && wd <= 5;

function nextWeekday(wd: number) {
  let d = wd;
  do {
    d = (d + 1) % 7;
  } while (!isWeekday(d));
  return d;
}

export type OpenStatus = { isOpen: boolean; text: string };

export function openStatus(now: Now = atlantaNow()): OpenStatus {
  const weekday = isWeekday(now.wd);
  if (weekday && now.mins >= OPEN && now.mins < CLOSE) {
    return { isOpen: true, text: "Open until 3:00 pm" };
  }
  if (weekday && now.mins < OPEN) {
    return { isOpen: false, text: "Closed. Opens 7:00 am today" };
  }
  const next = nextWeekday(now.wd);
  const day = next === (now.wd + 1) % 7 ? "tomorrow" : DAYS[next];
  return { isOpen: false, text: `Closed. Opens 7:00 am ${day}` };
}

/* 15-minute slots, earliest 15 minutes from now; once today is over, the next weekday. */
export function pickupSlots(now: Now = atlantaNow()): string[] {
  let start = Math.max(OPEN, Math.ceil((now.mins + SLOT_STEP) / SLOT_STEP) * SLOT_STEP);
  let label = "Today";
  if (!isWeekday(now.wd) || start > LAST_SLOT) {
    const next = nextWeekday(now.wd);
    start = OPEN;
    label = next === (now.wd + 1) % 7 ? "Tomorrow" : DAYS[next];
  }
  const slots: string[] = [];
  for (let m = start; m <= LAST_SLOT; m += SLOT_STEP) slots.push(`${label}, ${clock(m)}`);
  return slots;
}
