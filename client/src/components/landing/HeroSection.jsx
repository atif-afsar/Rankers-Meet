import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Trophy, Calendar, Clock, MapPin } from 'lucide-react';

export default function HeroSection({
  eventDate = 'Saturday, October 3, 2026',
  eventTime = '10:00 AM – 02:00 PM',
  venue = 'Aligarh, Uttar Pradesh',
  isRegistrationOpen = true,
}) {
  const shouldReduceMotion = useReducedMotion();

  // Staggered Entrance Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden bg-white text-[#101522] min-h-[68vh] lg:min-h-[74vh] flex items-center justify-center pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-18 lg:pb-20">
      {/* ========================================================= */}
      {/* 1. BACKGROUND: SUBTLE WARM/RED RADIAL GLOW & MINIMAL TEXTURE */}
      {/* ========================================================= */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(220, 38, 38, 0.045) 0%, rgba(220, 38, 38, 0.015) 35%, transparent 65%)',
        }}
      />

      {/* Extremely subtle dot grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:32px_32px] opacity-35 pointer-events-none -z-10" />

      {/* ========================================================= */}
      {/* 2. HERO VISUAL: ONE EXTREMELY SUBTLE RED CIRCULAR OUTLINE */}
      {/* ========================================================= */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0 overflow-hidden">
        {/* Subtle large circular hairline outline (cropped by viewport, adds depth) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  rotate: [0, 360],
                  scale: [1, 1.015, 1],
                }
          }
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
            scale: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="w-[580px] h-[580px] sm:w-[780px] sm:h-[780px] lg:w-[940px] lg:h-[940px] rounded-full border border-red-500/[0.09] flex items-center justify-center"
        >
          {/* Inner concentric hairline */}
          <div className="w-[82%] h-[82%] rounded-full border border-slate-300/[0.35] border-dashed" />
        </motion.div>
      </div>

      {/* ========================================================= */}
      {/* 3. CENTERED EDITORIAL COMPOSITION */}
      {/* ========================================================= */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* TOP ANNOUNCEMENT LABEL */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 mb-6 sm:mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D91F2B]" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.22em] text-[#D91F2B]">
              YASIR ALI CLASSES &nbsp;•&nbsp; PRESENTS
            </span>
          </motion.div>

          {/* MAIN HEADLINE WITH INTEGRATED MINIMAL TROPHY DETAIL */}
          <motion.div variants={itemVariants} className="relative w-full max-w-4xl mx-auto">
            {/* Minimal floating line-art trophy detail (slow, 3px float, no bouncing) */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, -4, 0],
                    }
              }
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="hidden md:inline-flex absolute -top-8 right-12 lg:right-24 items-center justify-center w-10 h-10 rounded-2xl bg-white border border-red-100 shadow-xs text-[#D91F2B]/85 pointer-events-none"
              title="Excellence Recognition"
            >
              <Trophy className="w-5 h-5 text-[#D91F2B] stroke-[1.75]" />
            </motion.div>

            {/* Editorial Main Headline */}
            <h1 className="font-heading font-black text-[#101522] tracking-tight leading-[0.98] sm:leading-[0.96]">
              <span className="block text-[clamp(2.5rem,8.5vw,5.4rem)]">
                RANKERS MEET
              </span>
              <span className="block text-[clamp(2.1rem,7.2vw,4.6rem)] text-[#D91F2B] mt-1 sm:mt-2">
                2026
              </span>
            </h1>
          </motion.div>

          {/* SUPPORTING TEXT (Short, max 2 lines desktop) */}
          <motion.p
            variants={itemVariants}
            className="mt-6 sm:mt-7 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Celebrating the students who turned dedication, discipline and academic
            excellence into achievement.
          </motion.p>

          {/* PRIMARY CTA (Single dominant action) */}
          <motion.div variants={itemVariants} className="mt-8 sm:mt-9 w-full sm:w-auto">
            {isRegistrationOpen ? (
              <Link
                to="/rankers-meet/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-4.5 rounded-2xl bg-[#D91F2B] hover:bg-[#B81724] text-white font-black text-sm uppercase tracking-wider shadow-md hover:shadow-xl hover:shadow-red-600/20 active:scale-[0.98] transition-all duration-200 group min-h-[48px]"
              >
                <span>CLAIM YOUR INVITE</span>
                <ArrowRight className="w-4 h-4 ml-2.5 group-hover:translate-x-1.5 transition-transform duration-200" />
              </Link>
            ) : (
              <div className="inline-flex items-center px-6 py-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold">
                Registrations are currently closed
              </div>
            )}
          </motion.div>

          {/* EVENT INFORMATION: EDITORIAL METADATA ROW */}
          <motion.div
            variants={itemVariants}
            className="mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-slate-200/70 flex flex-wrap items-center justify-center gap-y-2 gap-x-3 sm:gap-x-5 text-xs sm:text-sm font-semibold text-slate-600 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D91F2B] flex-shrink-0" />
              <span>{eventDate}</span>
            </div>

            <span className="text-slate-300 select-none hidden sm:inline">│</span>

            <div className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D91F2B] flex-shrink-0" />
              <span>{eventTime}</span>
            </div>

            <span className="text-slate-300 select-none hidden sm:inline">│</span>

            <div className="inline-flex items-center gap-1.5 truncate max-w-[280px] sm:max-w-xs">
              <MapPin className="w-3.5 h-3.5 text-[#D91F2B] flex-shrink-0" />
              <span className="truncate">{venue}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
