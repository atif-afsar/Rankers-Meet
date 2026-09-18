import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, GraduationCap, Award, BookOpen, Building } from 'lucide-react';

export default function AudienceCards({ categories = [] }) {
  const iconMap = {
    'ca-foundation': Award,
    'boards-commerce': BookOpen,
    'cuet-commerce': GraduationCap,
    'amu-entrance': Building,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {categories.map((item, idx) => {
          const Icon = iconMap[item.id] || Award;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-6 border border-[#F0D5D7] shadow-sm hover:shadow-card hover:border-[#D91F2B]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D91F2B] bg-[#FFF7F7] px-2.5 py-1 rounded-full border border-[#F0D5D7]">
                    {item.tag}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FFF7F7] border border-[#F0D5D7] flex items-center justify-center text-[#D91F2B] group-hover:bg-[#D91F2B] group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-heading font-black text-lg text-[#101522] group-hover:text-[#D91F2B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {item.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500">
                    Target: <strong className="text-[#101522]">{item.highlight}</strong>
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-extrabold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600 flex-shrink-0" />
                Eligible for Felicitation
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Parent accompaniment policy banner */}
      <div className="bg-[#FFF7F7] border border-[#F0D5D7] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#F0D5D7] flex items-center justify-center text-[#D91F2B] flex-shrink-0 shadow-sm">
            <Award className="w-4 h-4" />
          </div>
          <p className="text-slate-700">
            <strong className="text-[#101522]">Parent Accompaniment Policy:</strong> To ensure comfortable seating for every achiever, each student is warmly welcome to bring <strong>1 parent (either mother or father)</strong>.
          </p>
        </div>
        <span className="text-[11px] font-black uppercase tracking-wider text-[#D91F2B] whitespace-nowrap bg-white px-3 py-1.5 rounded-xl border border-[#F0D5D7] shadow-xs">
          VIP Parent Seating Included
        </span>
      </div>
    </div>
  );
}
