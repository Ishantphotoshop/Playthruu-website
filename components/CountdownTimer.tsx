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
    const interval = setInterval(function () {
      setTime(getTimeLeft());
    }, 1000);
    return function () {
      clearInterval(interval);
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
