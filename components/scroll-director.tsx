"use client";

import { useEffect } from "react";
import { stage, targets } from "@/lib/stage";
import { clamp, prefersReducedMotion } from "@/lib/util";

/* Turns scroll position into everything that follows the reader down the page: the rail
   drawing itself, each station's progress for the 3D tray, the lift indicator landing on C,
   the mobile dock stepping aside at the order section, and the route in Find us. */
export function ScrollDirector() {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    const byId = (id: string) => document.getElementById(id);
    const line = byId("line");
    const rail = byId("rail");
    const today = byId("today");
    const deli = byId("deli");
    const grill = byId("grill");
    const salad = byId("salad");
    const order = byId("order");
    const find = byId("find");
    if (!line || !rail || !today || !deli || !grill || !salad || !order || !find) return;

    const car = byId("car");
    const pin = byId("pin");
    const route = byId("route-path") as SVGPathElement | null;
    let routeLen = 0;
    try {
      routeLen = route?.getTotalLength() ?? 0;
      if (route && routeLen) route.style.strokeDasharray = String(routeLen);
    } catch {}

    /* 0 to 1 as the node's top edge travels up from `start` viewport heights over `span`. */
    const progress = (node: HTMLElement, start: number, span: number) =>
      clamp((window.innerHeight * start - node.getBoundingClientRect().top) / (window.innerHeight * span));

    function measure() {
      const vh = window.innerHeight;
      const lineRect = line!.getBoundingClientRect();
      rail!.style.setProperty("--draw", reduce ? "1" : clamp((vh * 0.82 - lineRect.top) / lineRect.height).toFixed(4));

      targets.soup = progress(today!, 0.8, 0.42);
      targets.stack = progress(deli!, 0.8, 0.6);
      targets.panini = progress(grill!, 0.8, 0.42);
      targets.salad = progress(salad!, 0.8, 0.42);
      targets.till = progress(order!, 0.85, 0.5);
      targets.out = progress(find!, 1, 0.6);
      targets.travel = clamp(-lineRect.top / Math.max(1, lineRect.height));

      document.body.classList.toggle("past", targets.out > 0.35);
      const orderRect = order!.getBoundingClientRect();
      document.body.classList.toggle("at-order", orderRect.top < vh * 0.45 && orderRect.bottom > vh * 0.5);

      const drawn = reduce ? 1 : progress(find!, 0.75, 0.75);
      if (route && routeLen) route.style.strokeDashoffset = (routeLen * (1 - drawn)).toFixed(1);
      car?.setAttribute("transform", `translate(0,${(clamp((drawn - 0.36) / 0.3) * 86).toFixed(1)})`);
      if (pin) pin.style.opacity = drawn > 0.96 ? "1" : "0.25";

      stage.wake();
    }

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
