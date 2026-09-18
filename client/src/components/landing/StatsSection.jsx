import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function CounterItem({ value, suffix, label, desc, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = typeof value === 'number' ? value : parseFloat(value);
    const duration = 1800; // 1.8s
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * ease;

      if (value % 1 !== 0) {
        setCount(parseFloat(current.toFixed(1)));
      } else {
        setCount(Math.floor(current));
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }, [inView, value]);

  return (
    <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-[#D91F2B]/60 transition-all group">
      <div className="flex items-baseline space-x-0.5">
        <span className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight group-hover:text-[#D91F2B] transition-colors">
          {count.toLocaleString()}
        </span>
        <span className="font-heading font-black text-2xl sm:text-3xl text-[#D91F2B]">
          {suffix}
        </span>
      </div>
      <h4 className="font-heading font-black text-sm sm:text-base text-slate-200 mt-2">
        {label}
      </h4>
      <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

export default function StatsSection({ stats = [] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="relative py-16 sm:py-20 bg-[#101522] text-white overflow-hidden">
      {/* Subtle red background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D91F2B]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#D91F2B] bg-[#D91F2B]/10 border border-[#D91F2B]/30 px-3 py-1 rounded-full">
            Proven Legacy
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mt-3 tracking-tight">
            Numbers That Speak For <span className="font-serif italic font-normal text-[#D91F2B]">Excellence</span>
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Over a decade and a half of consistently shaping high-ranking commerce professionals across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => (
            <CounterItem
              key={idx}
              value={item.value}
              suffix={item.suffix}
              label={item.label}
              desc={item.desc}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
