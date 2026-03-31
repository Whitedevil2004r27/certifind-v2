"use client";

import React, { useEffect, useState } from 'react';

interface StatsCounterProps {
  end: number;
  label: string;
  duration?: number;
  suffix?: string;
}

export default function StatsCounter({ end, label, duration = 2000, suffix = "" }: StatsCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-xl">
      <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[10px] sm:text-xs font-black text-certifind-accent uppercase tracking-[0.2em]">{label}</div>
    </div>
  );
}
