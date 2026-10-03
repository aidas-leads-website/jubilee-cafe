import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  LatheGeometry,
  LinearSRGBColorSpace,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  Shape,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type MeshStandardMaterialParameters,
  type Object3D,
} from "three";
import { stage, targets, type StageKey } from "./stage";
import { clamp, finePointer, lerp, prefersReducedMotion } from "./util";

type Options = {
  stageEl: HTMLElement;
  canvas: HTMLCanvasElement;
  /* Called when WebGL is unavailable or lost, so the page can show the flat illustration. */
  onFlat: () => void;
};

const KEYS: StageKey[] = ["soup", "stack", "panini", "salad", "till", "out", "travel"];

const easeBounce = (t: number) => {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
};
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeBack = (t: number) => {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

const mat = (color: number, roughness = 0.78, extra: MeshStandardMaterialParameters = {}) =>
  new MeshStandardMaterial({ color, roughness, metalness: 0, ...extra });

function mesh(g: BufferGeometry, m: Material, x = 0, y = 0, z = 0, parent?: Object3D) {
  const o = new Mesh(g, m);
  o.position.set(x, y, z);
  o.castShadow = true;
  o.receiveShadow = true;
  parent?.add(o);
  return o;
}

function roundedRect(w: number, h: number, r: number) {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/* Builds the tray scene on the given canvas and returns a function that tears it down. */
export function createTrayScene({ stageEl, canvas, onFlat }: Options): () => void {
  const reduce = prefersReducedMotion();
  const fine = finePointer();
  const seen = document.documentElement.classList.contains("seen");

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    onFlat();
    return () => {};
  }
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, fine ? 2 : 1.5));

  const scene = new Scene();
  const cam = new PerspectiveCamera(32, 1, 0.1, 100);

  /* Lighting was tuned on three r128, where light colours were not colour-managed and
     intensities were implicitly multiplied by PI. Both are reproduced here. */
  const raw = (hex: number) => new Color().setHex(hex, LinearSRGBColorSpace);
  scene.add(new HemisphereLight(raw(0xffffff), raw(0xb9c6c3), 0.62 * Math.PI));
  const sun = new DirectionalLight(raw(0xfff3e2), 0.58 * Math.PI);
  sun.position.set(-5, 9, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(fine ? 2048 : 1024, fine ? 2048 : 1024);
  const sc = sun.shadow.camera;
  sc.left = -14;
  sc.right = 14;
  sc.top = 12;
  sc.bottom = -12;
  sc.near = 1;
  sc.far = 40;
  sun.shadow.bias = -0.0006;
  sun.shadow.radius = 4;
  scene.add(sun);

  /* rails and brackets */
  const steel = mat(0xc3cac8, 0.38, { metalness: 0.25 });
  const railGeo = new CylinderGeometry(0.07, 0.07, 60, 14);
  railGeo.rotateZ(Math.PI / 2);
  for (const z of [-1, 0, 1]) mesh(railGeo, steel, 0, -0.07, z, scene);
  const brackets = new Group();
  scene.add(brackets);
  const bracketGeo = new BoxGeometry(0.12, 0.07, 2.5);
  for (let x = -24; x <= 24; x += 3) mesh(bracketGeo, steel, x, -0.17, 0, brackets);
  const floor = new Mesh(new PlaneGeometry(60, 24), new ShadowMaterial({ opacity: 0.17 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.62;
  floor.receiveShadow = true;
  scene.add(floor);

  /* tray */
  const tray = new Group();
  scene.add(tray);
  const trayMat = mat(0x1f8079, 0.55);
  const baseGeo = new ExtrudeGeometry(roundedRect(4.3, 3.1, 0.36), {
    depth: 0.08,
    bevelEnabled: false,
    curveSegments: 10,
  });
  baseGeo.rotateX(-Math.PI / 2);
  mesh(baseGeo, trayMat, 0, 0, 0, tray);
  const rimShape = roundedRect(4.3, 3.1, 0.36);
  rimShape.holes.push(roundedRect(4.0, 2.8, 0.26));
  const rimGeo = new ExtrudeGeometry(rimShape, { depth: 0.2, bevelEnabled: false, curveSegments: 10 });
  rimGeo.rotateX(-Math.PI / 2);
  mesh(rimGeo, trayMat, 0, 0, 0, tray);
  const TOP = 0.08;

  /* soup */
  const soup = new Group();
  soup.position.set(-1.28, TOP, -0.66);
  tray.add(soup);
  const cupMat = mat(0xf4f1e6, 0.7, { side: DoubleSide });
  mesh(new CylinderGeometry(0.4, 0.29, 0.56, 28, 1, true), cupMat, 0, 0.28, 0, soup);
  mesh(new CylinderGeometry(0.29, 0.29, 0.03, 28), cupMat, 0, 0.015, 0, soup);
  mesh(
    new CylinderGeometry(0.378, 0.336, 0.2, 28, 1, true),
    mat(0xf2a71b, 0.7, { side: DoubleSide }),
    0,
    0.3,
    0,
    soup,
  );
  mesh(new CylinderGeometry(0.378, 0.378, 0.02, 28), mat(0xd9622b, 0.5), 0, 0.47, 0, soup);
  const steamGeo = new SphereGeometry(0.075, 10, 8);
  const steam = Array.from({ length: 5 }, () => {
    const puff = new Mesh(
      steamGeo,
      new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }),
    );
    soup.add(puff);
    return puff;
  });

  /* club sandwich, layer by layer */
  const bread = mat(0xe0b36a);
  const SB = { x: 0.98, z: -0.5 };
  const layerSpecs: { g: BufferGeometry; m: Material; h: number; ry?: number }[] = [
    { g: new BoxGeometry(1.2, 0.14, 1.2), m: bread, h: 0.14 },
    { g: new CylinderGeometry(0.72, 0.72, 0.05, 9), m: mat(0x6fb04a), h: 0.05 },
    { g: new CylinderGeometry(0.58, 0.58, 0.07, 22), m: mat(0xe9c4ac), h: 0.07 },
    { g: new BoxGeometry(1.02, 0.04, 1.02), m: mat(0xf2b632), h: 0.04, ry: Math.PI / 4 },
    { g: new BoxGeometry(1.2, 0.12, 1.2), m: bread, h: 0.12 },
    { g: new CylinderGeometry(0.5, 0.5, 0.06, 22), m: mat(0xd8432b), h: 0.06 },
    { g: new BoxGeometry(1.3, 0.05, 0.46), m: mat(0x9c3b22), h: 0.05, ry: 0.3 },
    { g: new CylinderGeometry(0.7, 0.7, 0.05, 9), m: mat(0x7bbb54), h: 0.05, ry: 0.5 },
    { g: new BoxGeometry(1.2, 0.14, 1.2), m: bread, h: 0.14 },
  ];
  let stackY = TOP;
  const layers = layerSpecs.map((spec, i) => {
    const rest = new Vector3(SB.x, stackY + spec.h / 2, SB.z);
    stackY += spec.h;
    return {
      o: mesh(spec.g, spec.m, 0, 0, 0, tray),
      rest,
      /* where the layer floats before it joins the stack */
      fl: new Vector3(
        -0.55 + i * 0.33,
        1.5 + (i % 3) * 0.42 + (i % 2) * 0.16,
        SB.z + 0.3 + (((i * 7) % 5) - 2) * 0.3,
      ),
      frx: Math.sin(i * 2.1) * 0.55,
      frz: Math.cos(i * 1.3) * 0.5,
      ry: spec.ry ?? 0,
    };
  });
  const pick = new Group();
  tray.add(pick);
  mesh(new CylinderGeometry(0.016, 0.016, 0.5, 6), mat(0xd9c29a), 0, 0.2, 0, pick);
  mesh(new SphereGeometry(0.075, 12, 10), mat(0x6b8e23, 0.5), 0, 0.46, 0, pick);
  const pickRest = new Vector3(SB.x, stackY - 0.05, SB.z);

  /* panini */
  const panini = new Group();
  panini.position.set(-0.92, TOP, 0.74);
  panini.rotation.y = 0.32;
  tray.add(panini);
  mesh(new BoxGeometry(1.2, 0.26, 0.8), mat(0xc88a3a), 0, 0.13, 0, panini);
  mesh(new BoxGeometry(1.23, 0.06, 0.83), mat(0xf2d26b), 0, 0.13, 0, panini);
  const markGeo = new BoxGeometry(0.05, 0.014, 0.74);
  const markMat = mat(0x5a3414, 0.9);
  for (let i = -2; i <= 2; i++) mesh(markGeo, markMat, i * 0.22, 0.265, 0, panini).rotation.y = 0.5;

  /* salad bowl */
  const salad = new Group();
  salad.position.set(0.9, TOP, 0.84);
  tray.add(salad);
  const bowlPts = [
    new Vector2(0.001, 0.02),
    new Vector2(0.2, 0.02),
    new Vector2(0.4, 0.12),
    new Vector2(0.5, 0.3),
    new Vector2(0.52, 0.34),
  ];
  mesh(new LatheGeometry(bowlPts, 26), mat(0xf2a71b, 0.6, { side: DoubleSide }), 0, 0, 0, salad);
  const leafGeo = new IcosahedronGeometry(0.17, 0);
  const greens = [mat(0x6fb04a), mat(0x4e9a3a), mat(0x8cc665)];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const rad = i % 3 === 0 ? 0.12 : 0.3;
    const leaf = mesh(leafGeo, greens[i % 3], Math.cos(a) * rad, 0.27 + (i % 2) * 0.05, Math.sin(a) * rad, salad);
    leaf.scale.set(1, 0.5, 1);
    leaf.rotation.set(i, i * 2, i * 3);
  }
  const tomGeo = new SphereGeometry(0.075, 12, 10);
  const tomMat = mat(0xd8432b, 0.45);
  for (const [x, y, z] of [
    [0.2, 0.38, 0.1],
    [-0.16, 0.37, -0.18],
    [-0.05, 0.4, 0.24],
  ]) {
    mesh(tomGeo, tomMat, x, y, z, salad);
  }

  /* cookie */
  const cookie = new Group();
  cookie.position.set(-0.02, TOP, 1.02);
  tray.add(cookie);
  mesh(new CylinderGeometry(0.27, 0.27, 0.07, 20), mat(0xc99556), 0, 0.035, 0, cookie);
  const chipGeo = new BoxGeometry(0.06, 0.04, 0.06);
  const chipMat = mat(0x4a2a14, 0.6);
  [
    [0.1, 0.08],
    [-0.12, 0.02],
    [0.02, -0.13],
    [-0.06, 0.14],
    [0.15, -0.08],
  ].forEach(([x, z], i) => {
    mesh(chipGeo, chipMat, x, 0.075, z, cookie).rotation.y = i;
  });

  /* confetti (order confirmation only) */
  const confGeo = new BoxGeometry(0.12, 0.02, 0.16);
  const confCols = [0xd8432b, 0xf2a71b, 0x6fb04a, 0xf4f1e6, 0xe0b36a];
  const confetti = Array.from({ length: 64 }, (_, i) => {
    const o = new Mesh(confGeo, new MeshBasicMaterial({ color: confCols[i % 5] }));
    o.visible = false;
    tray.add(o);
    return { o, v: new Vector3(), w: new Vector3() };
  });
  let confT = -1;

  let hopV = 0;
  let hopY = 0;
  let px = 0;
  let py = 0;
  const onPointer = (e: PointerEvent) => {
    px = e.clientX / window.innerWidth - 0.5;
    py = e.clientY / window.innerHeight - 0.5;
  };

  const cur = { soup: 0, stack: 0, panini: 0, salad: 0, till: 0, out: 0, travel: 0, tx: 0, tz: 0 };
  let running = false;
  let frozen = false;
  let placed = false;
  let raf = 0;
  let slow = 0;
  let last = 0;
  let t0 = 0;
  let frames = 0;
  let fpsT = 0;
  let fpsChecks = 0;

  /* A station's item drops onto the tray with a squash and bounce as t goes 0 to 1. */
  function drop(g: Group, t: number) {
    g.visible = t > 0.002;
    if (!g.visible) return;
    const e = easeBounce(clamp(t));
    const s = 1 - Math.pow(1 - clamp(t * 2.5), 3);
    const squash = t > 0.3 && t < 0.5 ? 1 - Math.sin(((t - 0.3) / 0.2) * Math.PI) * 0.12 : 1;
    g.scale.set(s * (2 - squash), Math.max(0.001, s * squash), s * (2 - squash));
    g.position.y = TOP + (1 - e) * 2.6;
  }

  function size() {
    const w = stageEl.clientWidth;
    const h = stageEl.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
    /* resizing clears the canvas, so repaint when the loop is not doing it */
    if (!running && placed) renderer.render(scene, cam);
  }

  function place(time: number, intro: number) {
    placed = true;
    brackets.position.x = -((cur.travel * 14) % 3);
    tray.position.x = lerp(-11, 0, intro) + cur.out * 12;
    tray.position.y = hopY;
    tray.rotation.x = cur.tx;
    tray.rotation.z = cur.tz;
    drop(soup, cur.soup);
    drop(panini, cur.panini);
    drop(salad, cur.salad);
    drop(cookie, clamp(cur.salad * 1.4 - 0.4));
    const landed = cur.soup > 0.9 ? 1 : 0;
    steam.forEach((s, i) => {
      const ph = (time * 0.45 + i * 0.2) % 1;
      s.position.set(Math.sin(i * 2 + time * 0.8) * 0.1, 0.6 + ph * 0.8, Math.cos(i * 3) * 0.08);
      s.material.opacity = landed * Math.sin(ph * Math.PI) * 0.5;
      s.scale.setScalar(0.7 + ph * 1.1);
    });
    layers.forEach((L, i) => {
      const ti = easeIO(clamp((cur.stack - i * 0.06) / 0.46));
      const show = clamp(intro * 1.6 - i * 0.07);
      const bob = Math.sin(time * 1.25 + i * 1.1) * 0.07 * (1 - ti);
      L.o.position.set(lerp(L.fl.x, L.rest.x, ti), lerp(L.fl.y, L.rest.y, ti) + bob, lerp(L.fl.z, L.rest.z, ti));
      L.o.rotation.set(L.frx * (1 - ti), L.ry + (1 - ti) * (i * 0.5 + time * 0.12), L.frz * (1 - ti));
      L.o.scale.setScalar(Math.max(0.001, easeBack(show)));
    });
    const pt = clamp((cur.stack - 0.56) / 0.3);
    pick.visible = pt > 0.01;
    pick.position.set(pickRest.x, pickRest.y + (1 - easeIO(pt)) * 1.6, pickRest.z);

    /* camera: three-quarter view, pulling back and up as the tray reaches the till */
    const a = cam.aspect;
    const wideBand = a > 1.1;
    const fov = (cam.fov * Math.PI) / 180;
    const visH = Math.max(wideBand ? lerp(7.4, 5.6, cur.till) : 5.2, 6.3 / a);
    const dist = (visH / (2 * Math.tan(fov / 2))) * lerp(1, 1.04, cur.till);
    const az = lerp(-0.46, -0.1, cur.till);
    const elv = lerp(0.66, 1.02, cur.till);
    const ty = lerp(wideBand ? 1.45 : 0.6, wideBand ? 0.75 : 0.2, cur.till);
    cam.position.set(
      dist * Math.sin(az) * Math.cos(elv),
      ty + dist * Math.sin(elv),
      dist * Math.cos(az) * Math.cos(elv),
    );
    cam.lookAt(0, ty, 0);
  }

  /* The full tray as a single frame: the reduced-motion version and the low frame rate fallback. */
  function still() {
    for (const key of KEYS) cur[key] = targets[key];
    cur.soup = cur.stack = cur.panini = cur.salad = cur.till = 1;
    cur.out = 0;
    size();
    place(0, 1);
    renderer.render(scene, cam);
  }

  function disposeScene() {
    scene.traverse((o) => {
      if (!(o instanceof Mesh)) return;
      o.geometry.dispose();
      for (const m of ([] as Material[]).concat(o.material)) m.dispose();
    });
    renderer.dispose();
  }

  if (reduce) {
    still();
    window.addEventListener("resize", still);
    return () => {
      window.removeEventListener("resize", still);
      disposeScene();
    };
  }

  for (const key of KEYS) cur[key] = targets[key];

  function frame(now: number) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    if (!t0) t0 = now;
    const time = (now - t0) / 1000;
    const k = 1 - Math.exp(-dt * 7);
    for (const key of KEYS) cur[key] += (targets[key] - cur[key]) * k;
    cur.tx += (py * 0.1 - cur.tx) * k;
    cur.tz += (-px * 0.1 - cur.tz) * k;
    hopV -= 20 * dt;
    hopY = Math.max(0, hopY + hopV * dt);
    if (hopY === 0 && hopV < 0) hopV = 0;
    if (confT >= 0) {
      confT += dt;
      for (const c of confetti) {
        c.v.y -= 9.8 * dt;
        c.o.position.addScaledVector(c.v, dt);
        c.o.rotation.x += c.w.x * dt;
        c.o.rotation.y += c.w.y * dt;
        c.o.rotation.z += c.w.z * dt;
      }
      if (confT > 2.6) {
        confT = -1;
        for (const c of confetti) c.o.visible = false;
      }
    }
    /* the tray waits for the lift intro on a first visit, then slides in */
    const introAt = seen ? 0.05 : 1.15;
    const intro = time < introAt ? 0 : easeBack(clamp((time - introAt) / 0.9));
    place(time, intro);
    renderer.render(scene, cam);

    /* frame-rate guard: lower the pixel ratio first, then freeze to a still */
    frames++;
    fpsT += dt;
    const guard = !(window as Window & { JC_NO_GUARD?: boolean }).JC_NO_GUARD;
    if (guard && fpsT >= 2 && fpsChecks < 4 && time > 2.5) {
      const fps = frames / fpsT;
      frames = 0;
      fpsT = 0;
      fpsChecks++;
      if (fps < 30) {
        slow++;
        if (slow === 1) {
          renderer.setPixelRatio(1);
          sun.castShadow = false;
          size();
        } else {
          running = false;
          frozen = true;
          still();
          return;
        }
      }
    }
    /* once the tray has slid off at Find us there is nothing left to animate */
    if (cur.out > 0.995 && targets.out >= 1 && confT < 0) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || frozen || document.hidden) return;
    if (targets.out >= 1 && cur.out > 0.995) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  const onVisibility = () => {
    if (document.hidden) running = false;
    else start();
  };
  const onContextLost = (e: Event) => {
    e.preventDefault();
    running = false;
    onFlat();
  };

  stage.wake = start;
  stage.hop = () => {
    hopV = 2.3;
  };
  stage.burst = () => {
    if (!running) return;
    confT = 0;
    confetti.forEach((c, i) => {
      const a = i * 2.399;
      const sp = 1.4 + ((i * 37) % 10) / 6;
      c.o.position.set(Math.cos(a) * 0.4, 0.5, Math.sin(a) * 0.4);
      c.v.set(Math.cos(a) * sp, 4.2 + ((i * 13) % 10) / 3, Math.sin(a) * sp);
      c.w.set(3 + (i % 4), 2 + (i % 3), 4 + (i % 5));
      c.o.visible = true;
    });
  };

  if (fine) window.addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onContextLost);
  const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(size) : null;
  if (resizeObserver) resizeObserver.observe(stageEl);
  else window.addEventListener("resize", size);
  size();
  start();

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    stage.wake = stage.hop = stage.burst = () => {};
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    resizeObserver?.disconnect();
    window.removeEventListener("resize", size);
    disposeScene();
  };
}
