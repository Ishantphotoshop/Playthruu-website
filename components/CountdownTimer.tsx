"use client";

import { useEffect, useState } from "react";

// Launch: 20 October 2026, midnight India time.
export const LAUNCH_DATE = new Date("2026-10-20T00:00:00+05:30").getTime();

function getTimeLeft() {
  const diff = Math.max(LAUNCH_DATE - Date.now(), 0);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const UNITS = [
  { key: "days", label: "days" },
  { key: "hours", label: "hours" },
  { key: "minutes", label: "minutes" },
  { key: "seconds", label: "seconds" },
] as const;

export default function CountdownTimer() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A once-a-minute correction is enough to stay accurate without a
    // visibly ticking number for anyone who's asked for less motion.
    const tickMs = reduceMotion ? 60000 : 1000;
    const tick = () => setTime(getTimeLeft());

    let interval: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (!interval) interval = setInterval(tick, tickMs);
    };
    const stop = () => {
      if (interval) clearInterval(interval);
      interval = null;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else {
        tick();
        start();
      }
    };

    const first = setTimeout(tick, 0);
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(first);
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="countdown" role="timer" aria-label="Time until PlayThruu opens on 20 October">
      {UNITS.map((unit) => (
        <div key={unit.key} className="countdown__unit">
          <span className="countdown__value">{time ? String(time[unit.key]).padStart(2, "0") : "00"}</span>
          <span className="countdown__label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
