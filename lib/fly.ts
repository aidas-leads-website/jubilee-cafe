import { prefersReducedMotion, smallScreen } from "./util";

/* "Add to tray": a dot arcs from the tapped button to the tray counter, which then bumps. */
export function fly(from: HTMLElement) {
  const target = document.getElementById(smallScreen() ? "dock-count" : "bar-count");
  if (!target || prefersReducedMotion() || !from.animate) return;

  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.className = "fly";
  dot.style.left = `${a.right - 26}px`;
  dot.style.top = `${a.top + a.height / 2 - 8}px`;
  document.body.appendChild(dot);

  const dx = b.left + b.width / 2 - (a.right - 18);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const flight = dot.animate(
    [
      { transform: "translate(0,0) scale(1)" },
      { transform: `translate(${dx * 0.5}px,${dy * 0.5 - 70}px) scale(1.25)`, offset: 0.5 },
      { transform: `translate(${dx}px,${dy}px) scale(.5)` },
    ],
    { duration: 300, easing: "cubic-bezier(.3,0,.5,1)" },
  );
  flight.onfinish = () => {
    dot.remove();
    target.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.35)", offset: 0.4 }, { transform: "scale(1)" }],
      { duration: 300, easing: "ease" },
    );
  };
}
