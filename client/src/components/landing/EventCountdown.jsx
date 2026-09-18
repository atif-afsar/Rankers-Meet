import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

export default function EventCountdown({ targetDate, dateString, timeString }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    function calculateTime() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        isExpired: false,
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Background card glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D91F2B]/10 via-[#D91F2B]/5 to-[#C89B3C]/10 rounded-3xl blur-xl -z-10" />

      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#F0D5D7] shadow-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#F0D5D7]/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF7F7] border border-[#F0D5D7] flex items-center justify-center text-[#D91F2B] shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#D91F2B]">
                Event Countdown
              </p>
              <h3 className="font-heading font-black text-lg sm:text-xl text-[#101522]">
                The Celebration Begins In
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-[#FFF7F7] px-3.5 py-2 rounded-xl border border-[#F0D5D7]">
            <Calendar className="w-4 h-4 text-[#D91F2B] flex-shrink-0" />
            <span>{dateString} • {timeString}</span>
          </div>
        </div>

        {/* Counter Units Grid: Mobile-First 4-Card Row */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-5 sm:pt-6">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="relative flex flex-col items-center justify-center p-2.5 sm:p-5 rounded-2xl bg-gradient-to-b from-white to-[#FFF7F7]/60 border border-[#F0D5D7]/80 shadow-xs transition-all hover:shadow-md group min-w-0"
            >
              <div className="overflow-hidden h-9 sm:h-14 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={unit.value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#101522] tracking-tight"
                  >
                    {String(unit.value).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>

              <span className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-500 mt-1 sm:mt-2 truncate">
                {unit.label}
              </span>

              {/* Subtle top indicator on hover */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-transparent group-hover:bg-[#D91F2B] rounded-full transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
