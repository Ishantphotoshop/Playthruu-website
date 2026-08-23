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

export default function CountdownTimer() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const units = [
    { label: "DAYS", value: time.days },
    { label: "HRS", value: time.hours },
    { label: "MIN", value: time.minutes },
    { label: "SEC", value: time.seconds },
  ];

  return (
    <div className="flex gap-3 md:gap-5 font-mono">
      {units.map((u) => (
        <div
          key={u.label}
          className="flex flex-col items-center bg-[#171722] border border-white/10 rounded-lg px-4 py-3 md:px-6 md:py-4 min-w-[64px] md:min-w-[80px]"
        >
          <span className="text-2xl md:text-4xl font-semibold text-[#A78BFA] tabular-nums">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] md:text-xs text-gray-500 tracking-widest mt-1">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
