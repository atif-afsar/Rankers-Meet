import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Users,
  Trophy,
  HeartHandshake,
  Star,
  Quote,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCountdown from '../components/landing/EventCountdown';
import HeroSection from '../components/landing/HeroSection';
import EventTimeline from '../components/landing/EventTimeline';
import AudienceCards from '../components/landing/AudienceCards';
import StatsSection from '../components/landing/StatsSection';
import VenueSection from '../components/landing/VenueSection';
import MobileBottomDock from '../components/mobile/MobileBottomDock';
import { EVENT_DATA } from '../data/eventData';
import api from '../services/api';

export default function LandingPage() {
  const [settings, setSettings] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeGalleryTab, setActiveGalleryTab] = useState('all');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.get('/settings');
        if (res.data.success && res.data.data) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.error('[LandingPage] Could not load dynamic settings:', err);
      }
    }
    fetchSettings();
  }, []);

  const eventName = settings?.eventName || EVENT_DATA.name;
  const organization = settings?.organization || EVENT_DATA.organization;
  const tagline = settings?.tagline || EVENT_DATA.tagline;
  const eventDate = settings?.eventDate || EVENT_DATA.dateString;
  const eventTime = settings?.eventTime || EVENT_DATA.timeString;
  const venue = settings?.venue || EVENT_DATA.venueName;
  const address = settings?.address || EVENT_DATA.venueAddress;
  const isRegistrationOpen = settings
    ? settings.isRegistrationOpen !== false && settings.registrationOpen !== false
    : true;

  // Calculate targetDate dynamically for countdown timer if eventDate changes
  const targetDate = useMemo(() => {
    if (settings?.eventDate) {
      const parsed = Date.parse(settings.eventDate);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return EVENT_DATA.eventDateTimestamp;
  }, [settings?.eventDate]);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const galleryTabs = ['all', 'Stage Felicitation', 'Parent Pride', 'Academic Distinction', 'Mentorship', 'Banquet & Moments'];

  const filteredHighlights =
    activeGalleryTab === 'all'
      ? EVENT_DATA.highlights
      : EVENT_DATA.highlights.filter((h) => h.category === activeGalleryTab);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#101522] selection:bg-rose-100 selection:text-[#D91F2B] overflow-x-hidden">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      {settings?.announcement && (
        <div className="bg-[#101522] text-white px-4 py-2.5 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b border-slate-800">
          <Sparkles className="w-4 h-4 text-[#C89B3C] flex-shrink-0 animate-pulse" />
          <span>{settings.announcement}</span>
        </div>
      )}

      {/* 2. STICKY NAVBAR */}
      <Navbar
        isRegistrationOpen={isRegistrationOpen}
        eventName={eventName}
        organization={organization}
      />

      {/* 3. HERO SECTION */}
      <HeroSection
        eventName={eventName}
        organization={organization}
        tagline={tagline}
        eventDate={eventDate}
        eventTime={eventTime}
        venue={venue}
        isRegistrationOpen={isRegistrationOpen}
      />

      {/* 4. COUNTDOWN INTEGRATION (Section 13) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 mb-16 sm:mb-20 relative z-30">
        <EventCountdown
          targetDate={targetDate}
          dateString={eventDate}
          timeString={eventTime}
        />
      </div>

      {/* 5. WHY THIS EVENT MATTERS (Section 17 in Spec) */}
      <section id="about" className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#D91F2B] bg-[#FFF7F7] px-3.5 py-1.5 rounded-full border border-[#F0D5D7] inline-block">
                The Philosophy
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#101522] tracking-tight leading-tight">
                Success Deserves to Be <span className="font-serif italic font-normal text-[#D91F2B]">Celebrated</span>.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Rankers Meet is not just another felicitation ceremony. It is the pinnacle gathering where countless hours of early-morning studies, resolved doubts, and sheer persistence culminate in public stage recognition.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We believe when an achiever stands on stage with their parents, it inspires hundreds of juniors to dream bigger and aim higher.
              </p>

              <div className="pt-2">
                <Link
                  to="/rankers-meet/register"
                  className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#D91F2B] hover:text-[#B81724] group"
                >
                  Claim Your Stage Honor
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-6 rounded-3xl bg-[#FFF7F7] border border-[#F0D5D7] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#F0D5D7] flex items-center justify-center text-[#D91F2B] shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-black text-lg text-[#101522]">
                  Stage Recognition
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every qualifying ranker receives an engraved trophy, medal, and official Certificate of Distinction from Yasir Ali Sir.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FFF7F7] border border-[#F0D5D7] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#F0D5D7] flex items-center justify-center text-[#D91F2B] shadow-xs">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-black text-lg text-[#101522]">
                  Parent Pride Honor
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Felicitation shawls and tokens of honor bestowed upon parents who stood as the backbone of each student’s achievement.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FFF7F7] border border-[#F0D5D7] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#F0D5D7] flex items-center justify-center text-[#D91F2B] shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-black text-lg text-[#101522]">
                  Career Roadmap
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  One-on-one sessions guiding achievers on CA Intermediate articleship, entrance counseling, and premier university admissions.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FFF7F7] border border-[#F0D5D7] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#F0D5D7] flex items-center justify-center text-[#D91F2B] shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-black text-lg text-[#101522]">
                  Commerce Network
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect with fellow qualifiers, alumni now at SRCC, AMU, and Big-4 accounting firms, and your faculty mentors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE SCHEDULE TIMELINE (Section 15 in Spec) */}
      <section id="schedule" className="py-20 bg-slate-50 border-t border-b border-[#F0D5D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D91F2B] bg-white border border-[#F0D5D7] px-3.5 py-1.5 rounded-full shadow-xs">
              Event Itinerary
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101522] mt-3 tracking-tight">
              Ceremony <span className="font-serif italic font-normal text-[#D91F2B]">Timeline</span>
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A structured, celebratory program designed to honor student rankers, families, and chart future academic milestones.
            </p>
          </div>

          <EventTimeline schedule={EVENT_DATA.schedule} />
        </div>
      </section>

      {/* 7. WHO CAN ATTEND SECTION (Section 16 in Spec) */}
      <section id="eligibility" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D91F2B] bg-[#FFF7F7] border border-[#F0D5D7] px-3.5 py-1.5 rounded-full">
              Eligibility
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101522] mt-3 tracking-tight">
              Who Is Eligible to <span className="font-serif italic font-normal text-[#D91F2B]">Register</span>?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Registration is open to all students of Yasir Ali Classes who achieved success in commerce exams and board qualifications.
            </p>
          </div>

          <AudienceCards categories={EVENT_DATA.audienceCategories} />
        </div>
      </section>

      {/* 8. VERIFIED ACHIEVERS & TESTIMONIALS (Section 18 in Spec) */}
      <section className="py-20 bg-[#FFF7F7]/60 border-t border-[#F0D5D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D91F2B] bg-white border border-[#F0D5D7] px-3.5 py-1.5 rounded-full shadow-xs">
              Student Voices
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101522] mt-3 tracking-tight">
              Honoring Our <span className="font-serif italic font-normal text-[#D91F2B]">Champions</span>
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Real reflections from students who walked the Rankers Meet red carpet and achieved historic ranks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EVENT_DATA.testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-[#F0D5D7] shadow-sm flex flex-col justify-between hover:shadow-card transition-all group"
              >
                <div>
                  <Quote className="w-8 h-8 text-[#D91F2B]/30 mb-3" />
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF7F7] border border-[#F0D5D7] flex items-center justify-center text-[#D91F2B] font-black text-xs">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-sm text-[#101522]">{t.name}</h5>
                    <p className="text-[11px] font-bold text-[#D91F2B]">{t.achievement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TOP RANKERS STORYTELLING SHOWCASE (Sections 25-26 in Mobile Spec) */}
      <section id="rankers" className="py-16 sm:py-24 bg-slate-50 border-t border-b border-[#F0D5D7] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D91F2B] bg-white border border-[#F0D5D7] px-3.5 py-1.5 rounded-full shadow-xs">
              Commerce Champions
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#101522] mt-3 tracking-tight">
              Hall of <span className="font-serif italic font-normal text-[#D91F2B]">Distinction</span>
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A glimpse into the extraordinary milestones achieved by Yasir Ali Classes rankers across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {EVENT_DATA.rankers?.map((ranker) => (
              <motion.div
                key={ranker.rank}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="relative bg-white rounded-3xl p-6 sm:p-7 border border-[#F0D5D7] shadow-sm hover:shadow-card transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Large Background Rank Digits (01, 02, 03) */}
                <span className="absolute -top-3 -right-2 font-heading font-black text-7xl sm:text-8xl text-slate-100/80 group-hover:text-rose-100/60 transition-colors pointer-events-none select-none">
                  {ranker.rank}
                </span>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D91F2B] bg-[#FFF7F7] px-2.5 py-1 rounded-full border border-[#F0D5D7]">
                      {ranker.tag}
                    </span>
                    <span className="text-xs font-black text-[#C89B3C]">
                      ★ {ranker.highlight}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-xl text-[#101522] group-hover:text-[#D91F2B] transition-colors">
                    {ranker.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    {ranker.exam}
                  </p>

                  <div className="mt-4 p-3.5 rounded-2xl bg-[#FFF7F7]/60 border border-[#F0D5D7]/60 text-xs italic text-slate-700">
                    &ldquo;{ranker.quote}&rdquo;
                  </div>
                </div>

                <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">{ranker.category}</span>
                  <span className="font-black text-[#D91F2B]">Stage Felicitation</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. STATS COUNTER SECTION (Section 19 in Spec) */}
      <StatsSection stats={EVENT_DATA.stats} />

      {/* 10. EVENT HIGHLIGHTS GALLERY (Section 20 in Spec) */}
      <section id="highlights" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#D91F2B] bg-[#FFF7F7] px-3 py-1 rounded-full border border-[#F0D5D7]">
                Memories & Moments
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101522] mt-3 tracking-tight">
                Event <span className="font-serif italic font-normal text-[#D91F2B]">Highlights</span>
              </h2>
              <p className="text-sm text-slate-600 mt-1.5">
                Glances from previous annual felicitation meets organized by Yasir Ali Classes.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {galleryTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveGalleryTab(tab)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all ${
                    activeGalleryTab === tab
                      ? 'bg-[#D91F2B] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'all' ? 'All Highlights' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHighlights.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedGalleryItem(item)}
                className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl cursor-pointer group h-80 flex flex-col justify-end p-6 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Real High-Resolution Event Photo */}
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient}`} />
                )}

                {/* Cinematic Vignette Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#101522] via-[#101522]/65 to-black/20 group-hover:via-[#101522]/50 transition-colors duration-300" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

                <div className="relative z-10 space-y-1.5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C89B3C] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 inline-block mb-1">
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-bold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      View Photo ↗
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-lg sm:text-xl leading-snug group-hover:text-[#C89B3C] transition-colors drop-shadow-md">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Gallery */}
      <AnimatePresence>
        {selectedGalleryItem && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedGalleryItem(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-xl w-full text-[#101522] border border-slate-200 shadow-2xl space-y-0"
            >
              {/* Modal Image Preview */}
              {selectedGalleryItem.imageUrl && (
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
                  <img
                    src={selectedGalleryItem.imageUrl}
                    alt={selectedGalleryItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-black uppercase tracking-widest text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {selectedGalleryItem.badge}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedGalleryItem(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black flex items-center justify-center font-bold text-base transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="p-6 sm:p-7 space-y-3">
                <h3 className="font-heading font-black text-xl sm:text-2xl text-[#101522]">
                  {selectedGalleryItem.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedGalleryItem.subtitle}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#D91F2B]">
                    Rankers Meet Annual Archive
                  </span>
                  <button
                    onClick={() => setSelectedGalleryItem(null)}
                    className="px-5 py-2.5 bg-[#D91F2B] hover:bg-[#B81724] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 11. VENUE SECTION (Section 30 in Spec) */}
      <VenueSection
        venueName={venue}
        venueAddress={address}
        dateString={eventDate}
        timeString={eventTime}
        mapUrl={settings?.mapUrl || EVENT_DATA.mapUrl}
        helplinePhone={settings?.contactPhone || EVENT_DATA.helplinePhone}
      />

      {/* 12. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D91F2B] bg-[#FFF7F7] border border-[#F0D5D7] px-3.5 py-1.5 rounded-full">
              Queries & Answers
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101522] mt-3 tracking-tight">
              Frequently Asked <span className="font-serif italic font-normal text-[#D91F2B]">Questions</span>
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Everything you need to know about attendance, digital tickets, and seating logistics.
            </p>
          </div>

          <div className="space-y-3">
            {EVENT_DATA.faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#F0D5D7] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-[#FFF7F7]/40 transition-colors"
                >
                  <span className="font-heading font-bold text-sm sm:text-base text-[#101522]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D91F2B] flex-shrink-0 transition-transform duration-200 ${
                      openFaqIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FINAL HIGH-CONVERSION CTA (Section 53 in Spec) */}
      <section className="relative py-20 sm:py-24 bg-[#101522] text-white overflow-hidden text-center">
        {/* Glow ambient */}
        <div className="absolute inset-0 bg-[radial-gradient(#D91F2B_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#D91F2B]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-black uppercase tracking-widest text-[#C89B3C] bg-white/10 px-4 py-1.5 rounded-full border border-white/20 inline-block">
            Your Achievement Deserves a Moment
          </span>

          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Celebrate Your Triumphs on the <br />
            <span className="font-serif italic font-normal text-[#D91F2B]">Grand Stage</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join Yasir Ali Sir, respected faculty mentors, and fellow commerce achievers on <strong>{eventDate}</strong> at <strong>{venue}</strong>. Reserve your complimentary pass today.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isRegistrationOpen ? (
              <Link
                to="/rankers-meet/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-9 py-4 rounded-2xl bg-[#D91F2B] hover:bg-[#B81724] text-white font-black text-xs uppercase tracking-wider shadow-xl hover:shadow-[0_0_35px_rgba(217,31,43,0.4)] transition-all transform hover:-translate-y-0.5 group"
              >
                <Ticket className="w-4 h-4 mr-2 text-[#C89B3C]" />
                REGISTER FOR {eventName.toUpperCase()} →
              </Link>
            ) : (
              <div className="inline-flex items-center px-6 py-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold">
                <ShieldAlert className="w-4 h-4 mr-2 text-rose-400" />
                Registrations Closed
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 14. FOOTER */}
      <Footer
        eventName={eventName}
        organization={organization}
      />

      {/* 15. MOBILE STICKY BOTTOM REGISTRATION DOCK (Section 10 in Mobile Spec) */}
      <MobileBottomDock
        isRegistrationOpen={isRegistrationOpen}
        eventName={eventName}
      />
    </div>
  );
}
