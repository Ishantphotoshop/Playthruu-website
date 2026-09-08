"use client";

import { useEffect, useState } from "react";

const LAUNCH_DATE = new Date("2026-09-12T00:00:00+05:30").getTime();

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
  { key: "days", label: "DAYS" },
  { key: "hours", label: "HRS" },
  { key: "minutes", label: "MIN" },
  { key: "seconds", label: "SEC" },
] as const;

export default function CountdownTimer() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // A once-a-minute correction is enough to stay accurate without a
    // visibly ticking number for anyone who's asked for less motion.
    const tickMs = reduceMotion ? 60000 : 1000;

    let interval: ReturnType<typeof setInterval> | null = null;
    function start() {
      if (interval) return;
      interval = setInterval(function () {
        setTime(getTimeLeft());
      }, tickMs);
    }
    function stop() {
      if (!interval) return;
      clearInterval(interval);
      interval = null;
    }
    function handleVisibility() {
      if (document.hidden) stop();
      else {
        setTime(getTimeLeft());
        start();
      }
    }

    start();
    document.addEventListener("visibilitychange", handleVisibility);
    return function () {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="countdown" aria-label="Countdown to launch">
      {UNITS.map(function (unit) {
        return (
          <div key={unit.key} className="countdown-unit">
            <span className="countdown-value">
              {time ? String(time[unit.key]).padStart(2, "0") : "--"}
            </span>
            <span className="countdown-label">{unit.label}</span>
          </div>
        );
      })}
    </div>
  );
}
