import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, Users, Utensils, Sparkles } from 'lucide-react';

export default function EventTimeline({ schedule = [] }) {
  const icons = [Users, Sparkles, Award, Sparkles, Utensils];

  return (
    <div className="relative">
      <div className="relative max-w-5xl mx-auto">
        {/* Desktop horizontal timeline line */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#D91F2B]/20 via-[#D91F2B] to-[#D91F2B]/20 -translate-y-1/2 rounded-full pointer-events-none" />

        {/* Mobile vertical timeline connecting line */}
        <div className="md:hidden absolute top-6 bottom-6 left-6 w-0.5 bg-gradient-to-b from-[#D91F2B] via-[#D91F2B]/50 to-[#D91F2B]/10 -translate-x-1/2 rounded-full pointer-events-none" />

        <div className="flex flex-col md:grid md:grid-cols-5 gap-6 sm:gap-6 relative z-10">
          {schedule.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center group gap-4 md:gap-0"
              >
                {/* Time Indicator Node */}
                <div className="relative flex-shrink-0 mb-0 md:mb-5 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#D91F2B] text-[#D91F2B] flex items-center justify-center font-bold shadow-md group-hover:scale-110 group-hover:bg-[#D91F2B] group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="hidden md:block absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-black text-[#D91F2B] uppercase tracking-wider bg-[#FFF7F7] px-2.5 py-0.5 rounded-full border border-[#F0D5D7]">
                    {item.time}
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F0D5D7] shadow-sm group-hover:shadow-card transition-all w-full flex-1">
                  {/* Mobile time pill */}
                  <div className="md:hidden inline-flex items-center space-x-1 text-xs font-bold text-[#D91F2B] bg-[#FFF7F7] px-2.5 py-1 rounded-full border border-[#F0D5D7] mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.time}</span>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D91F2B] bg-[#FFF7F7] px-2 py-0.5 rounded border border-[#F0D5D7] block md:inline-block mb-2">
                    {item.badge}
                  </span>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-[#101522] leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
