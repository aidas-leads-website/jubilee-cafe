/* Shared between the scroll director, which writes, and the 3D tray scene, which reads. */

/* Scroll progress per station, each 0 to 1. */
export const targets = {
  soup: 0,
  stack: 0,
  panini: 0,
  salad: 0,
  till: 0,
  out: 0,
  travel: 0,
};

export type StageKey = keyof typeof targets;

const noop = () => {};

/* The scene swaps these for real handlers once it has loaded. */
export const stage = {
  wake: noop,
  hop: noop,
  burst: noop,
};
