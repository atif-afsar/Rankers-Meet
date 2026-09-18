import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, PlayCircle, Calendar, MapPin } from 'lucide-react';

export default function HeroSection({
  eventDate = 'Sunday, October 4, 2026',
  eventTime = '',
  venue = 'Royal Fort, Aligarh',
  isRegistrationOpen = true,
}) {
  const shouldReduceMotion = useReducedMotion();

  // Entrance animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#FAFAFA] text-[#101522] min-h-[76vh] lg:min-h-[82vh] flex flex-col justify-between pt-10 pb-8 sm:pt-14 sm:pb-10 lg:pt-16 lg:pb-12">
      {/* ========================================================= */}
      {/* 1. VIVID AURA BACKGROUND (IMAGE + CSS GLOW LAYER)         */}
      {/* ========================================================= */}
      {/* Base CSS aura glow for instant radiant colors */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle 500px at 0% 100%, rgba(249, 115, 22, 0.22) 0%, rgba(251, 146, 60, 0.10) 50%, transparent 80%),
            radial-gradient(circle 550px at 100% 50%, rgba(239, 68, 68, 0.25) 0%, rgba(244, 63, 94, 0.12) 50%, transparent 80%)
          `,
        }}
      />

      {/* High-resolution aura silk waves image */}
      <div
        className="absolute inset-0 pointer-events-none z-0 bg-no-repeat bg-cover bg-center mix-blend-multiply opacity-95"
        style={{
          backgroundImage: "url('/images/hero-aura-bg.jpg')",
        }}
      />

      {/* Center luminous white radial fade to ensure text clarity */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 48%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.70) 50%, transparent 85%)',
        }}
      />

      {/* ========================================================= */}
      {/* 2. CENTER CONTENT (AURA EDITORIAL TYPOGRAPHY & BUTTONS)   */}
      {/* ========================================================= */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto z-10 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Main Display Headline (Clean 2-line layout with thin, elegant typography matching Aura reference) */}
          <motion.h1
            variants={itemVariants}
            className="font-heading font-medium text-[#101522] tracking-tight leading-[1.12] sm:leading-[1.1] text-[clamp(2.4rem,5.8vw,4.2rem)] max-w-4xl"
          >
            Rankers Meet 2026 <br />
            <span className="inline-block mt-1 sm:mt-1.5">
              For <span className="text-[#D91F2B]">Academic Champions.</span>
            </span>
          </motion.h1>

          {/* Subtitle description (2 lines, clean gray, matching reference) */}
          <motion.p
            variants={itemVariants}
            className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed font-normal"
          >
            Honoring the students who turned dedication, discipline, and academic excellence into historic achievement. Claim your invite to the stage.
          </motion.p>

          {/* Dual Action Buttons (Black Primary ↗ and White Secondary ⊙) */}
          <motion.div
            variants={itemVariants}
            className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full sm:w-auto"
          >
            {isRegistrationOpen ? (
              <Link
                to="/rankers-meet/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#101522] hover:bg-[#D91F2B] text-white font-bold text-sm tracking-wide shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 group min-h-[46px]"
              >
                <span>Claim Your Invite</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            ) : (
              <div className="inline-flex items-center px-6 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold">
                Registrations are currently closed
              </div>
            )}

            <a
              href="#about"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200/90 shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all min-h-[46px] group"
            >
              <span>Explore Ceremony</span>
              <PlayCircle className="w-4 h-4 ml-2 text-slate-400 group-hover:text-[#D91F2B] transition-colors" />
            </a>
          </motion.div>

          {/* Compact Event Date & Venue Badge (Clean Oct 4, 2026 & Royal Fort, Aligarh) */}
          <motion.div
            variants={itemVariants}
            className="mt-6 sm:mt-7 inline-flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 text-xs font-semibold text-slate-600 bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full border border-slate-200/70 shadow-2xs"
          >
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D91F2B]" />
              <span>{eventDate}</span>
            </div>

            <span className="text-slate-300 select-none">&bull;</span>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D91F2B]" />
              <span>{venue}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ========================================================= */}
      {/* 3. BOTTOM INSTITUTIONAL TRUST BAR                         */}
      {/* (Pixel-styled matching the Framer, Miro, Notion logos)    */}
      {/* ========================================================= */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 sm:mt-12 pt-5 border-t border-slate-200/60 text-center z-10">
        <p className="text-[11px] sm:text-xs font-medium text-slate-500 mb-4 tracking-wide">
          Celebrating top rankers and qualifiers across premier institutions
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14 text-slate-700">
          <div className="flex items-center gap-2 font-heading font-black text-sm tracking-tight hover:text-[#D91F2B] transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-[#D91F2B]" />
            <span>AMU Aligarh</span>
          </div>
          <div className="flex items-center gap-2 font-heading font-black text-sm tracking-tight hover:text-amber-600 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Jamia Millia</span>
          </div>
          <div className="flex items-center gap-2 font-heading font-black text-sm tracking-tight hover:text-emerald-600 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ICAI CA Wing</span>
          </div>
          <div className="flex items-center gap-2 font-heading font-black text-sm tracking-tight hover:text-blue-600 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>CUET (UG/PG)</span>
          </div>
          <div className="flex items-center gap-2 font-heading font-black text-sm tracking-tight hover:text-purple-600 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>SRCC / DU</span>
          </div>
        </div>
      </div>
    </section>
  );
}
