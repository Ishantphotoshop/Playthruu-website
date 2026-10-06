"use client";

import { useEffect, useRef, type RefObject } from "react";

// The hero's game wall as a living environment.
//
// Why this replaced the old scrubbed animation: that version tied each
// column's position to scroll progress, and a second tween (the entrance)
// wrote the same property, so scrolling to the top could leave the wall
// parked in the entrance's "before" pose with nothing on screen. Anything
// that is a function of scroll position has a start and an end, and
// anything with an end can be reset.
//
// So the wall never reads its position from the scrollbar. Each column
// owns a `phase`: how far through its loop it is, 0..1. The phase only
// ever moves forward in time, and wraps. Every column is rendered as N
// identical stacks of the same posters, so wrapping 1 → 0 is a jump
// between two pictures that are pixel-identical. There is no moment at
// which it could be seen.
//
// Scrolling does not set the phase either; it adds to its *speed*. Scroll
// velocity is smoothed (quick to react, slow to settle) and each column
// follows it by a different amount, so the wall shears as you scroll and
// glides to rest afterwards. Scroll back up and the columns simply move
// the other way from wherever they are.
//
// Only transforms are written (translate3d in % of the column, so no
// layout is ever needed to position it), one write per column per frame.
// The loop stops while the hero is off screen or the tab is hidden and
// keeps its phases, so coming back continues from where it left off.

export type WallTuning = {
  /** px/s each column drifts at rest. + moves up, − moves down. */
  idle: number[];
  /** Extra px/s of travel per px/s of scroll, per column (depth). */
  follow: number[];
  /** Where each column starts in its loop, 0..1. Also baked into the SSR transform. */
  seeds: number[];
  /**
   * Lead-in, in loops: the track always sits this far up, so there is
   * content above the visible window at every phase. Without it the
   * space above a column's first poster is empty at phase 0 and filled
   * a moment later, and the wrap would pop a poster in at the top edge.
   */
  pad: number;
  /** The wall as a whole travels this fraction of scrollY, so it trails the page. */
  parallax: number;
};

const MAX_SCROLL_V = 2200; // px/s; a hard flick shouldn't throw the wall
const ATTACK = 11; // 1/s: how fast the wall picks up scroll speed
const RELEASE = 3.4; // 1/s: how slowly it lets go (~0.3s glide)
// At rest the wall drifts under 1px per write even at ~30 per second, so
// it is only written that often; the moment scroll speed picks up it is
// written every frame again. Halves the idle cost on a 60Hz screen.
const REST_WRITE_MS = 30;
const REST_SPEED = 30; // px/s of scroll below which the page counts as at rest

const wrap01 = (v: number) => ((v % 1) + 1) % 1;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function useLivingWall(root: RefObject<HTMLElement | null>, tuning: WallTuning) {
  const api = useRef({ rewrite: () => {} });
  useEffect(
    function () {
      const hero = root.current;
      if (!hero) return;
      const wall = hero.querySelector<HTMLElement>(".hero__wall");
      const content = hero.querySelector<HTMLElement>(".hero__content");
      const tracks = Array.from(hero.querySelectorAll<HTMLElement>(".shelf__track"));
      if (!wall || !content || tracks.length === 0) return;

      const handle = api.current;
      const phase = tracks.map((_, i) => tuning.seeds[i] ?? 0);
      // Length of one loop in px (one stack), kept fresh by the observer.
      const loopPx = tracks.map(() => 1000);
      let heroH = hero.offsetHeight || 800;

      const ro = new ResizeObserver(function (entries) {
        for (const entry of entries) {
          if (entry.target === hero) {
            heroH = entry.contentRect.height || heroH;
            continue;
          }
          const i = tracks.findIndex((t) => t.firstElementChild === entry.target);
          const h = entry.borderBoxSize?.[0]?.blockSize ?? (entry.target as HTMLElement).offsetHeight;
          if (i >= 0 && h > 0) loopPx[i] = h;
        }
      });
      ro.observe(hero);
      tracks.forEach((t) => t.firstElementChild && ro.observe(t.firstElementChild));

      // translateY in % is of the track's own height, which is (stacks ×
      // loop), so the offset in loops is (pad + phase) / stacks. The stack
      // count is read from the DOM at write time, and `rewrite` below lets
      // React re-run this synchronously, before paint, when it adds a
      // stack, so no frame can ever pair the old count with the new height.
      //
      // Written as a direct transform on purpose. A CSS custom property
      // looked tidier, but it is inherited, so changing it every frame made
      // Chrome re-resolve styles for every poster in every column (~450ms of
      // main-thread time per second). A transform touches one element.
      const writeTracks = () => {
        for (let i = 0; i < tracks.length; i++) {
          const stacks = tracks[i].childElementCount || 1;
          tracks[i].style.transform = "translate3d(0," + (-((tuning.pad + phase[i]) / stacks) * 100).toFixed(4) + "%,0)";
        }
      };
      handle.rewrite = writeTracks;

      // Scroll-position effects are fine when they are the identity at
      // the top: nothing about them can be "left behind" after scrolling.
      const writeScrollEffects = (y: number) => {
        const p = clamp(y / heroH, 0, 1);
        wall.style.transform = "translate3d(0," + (y * tuning.parallax).toFixed(2) + "px,0)";
        content.style.transform = "translate3d(0," + (-p * 18).toFixed(3) + "%,0)";
        content.style.opacity = String(1 - 0.8 * p);
      };

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      let raf = 0;
      let running = false;
      let inView = true;
      let last = 0;
      let lastY = 0;
      let vel = 0;
      let lastWrite = 0;
      let lastEffectsY = Number.NaN;

      const tick = (now: number) => {
        // Clamped, so a throttled or just-resumed tab never takes a big step.
        const dt = clamp((now - last) / 1000, 0.001, 0.05);
        last = now;
        const y = window.scrollY;
        const target = clamp((y - lastY) / dt, -MAX_SCROLL_V, MAX_SCROLL_V);
        lastY = y;
        vel += (target - vel) * (1 - Math.exp(-(Math.abs(target) > Math.abs(vel) ? ATTACK : RELEASE) * dt));

        for (let i = 0; i < tracks.length; i++) {
          const pxPerSec = (tuning.idle[i] ?? 0) + (tuning.follow[i] ?? 0) * vel;
          phase[i] = wrap01(phase[i] + (pxPerSec * dt) / loopPx[i]);
        }
        const atRest = Math.abs(vel) < REST_SPEED && Math.abs(target) < REST_SPEED;
        if (!atRest || now - lastWrite >= REST_WRITE_MS) {
          writeTracks();
          lastWrite = now;
        }
        if (y !== lastEffectsY) {
          writeScrollEffects(y);
          lastEffectsY = y;
        }
        raf = requestAnimationFrame(tick);
      };

      const start = () => {
        if (running || reduce.matches || !inView || document.hidden) return;
        running = true;
        last = performance.now();
        lastY = window.scrollY;
        vel = 0;
        lastEffectsY = Number.NaN;
        raf = requestAnimationFrame(tick);
      };
      const stop = () => {
        if (!running) return;
        running = false;
        cancelAnimationFrame(raf);
      };

      const io = new IntersectionObserver(
        function ([entry]) {
          inView = entry.isIntersecting;
          if (inView) start();
          else stop();
        },
        { rootMargin: "80px 0px" },
      );
      io.observe(hero);

      const onVisibility = () => (document.hidden ? stop() : start());
      const onMotionPref = () => {
        if (reduce.matches) {
          stop();
          wall.style.transform = "";
          content.style.transform = "";
          content.style.opacity = "";
        } else {
          start();
        }
      };
      document.addEventListener("visibilitychange", onVisibility);
      reduce.addEventListener("change", onMotionPref);

      writeTracks();
      start();

      return function () {
        stop();
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        reduce.removeEventListener("change", onMotionPref);
        handle.rewrite = () => {};
      };
    },
    // tuning is a module constant in the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [root],
  );
  return api;
}
