import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Award, Menu, X, ShieldCheck, Ticket, ArrowRight } from 'lucide-react';

export default function Navbar({
  isRegistrationOpen = true,
  eventName = 'Rankers Meet 2026',
  organization = 'Yasir Ali Classes',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isRegisterPage = location.pathname === '/rankers-meet/register';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems = [
    { label: 'HOME', href: '/rankers-meet' },
    { label: 'ABOUT EVENT', href: '#about' },
    { label: 'CEREMONY SCHEDULE', href: '#schedule' },
    { label: 'WHO CAN ATTEND', href: '#eligibility' },
    { label: 'EVENT HIGHLIGHTS', href: '#highlights' },
    { label: 'AUDITORIUM & VENUE', href: '#venue' },
    { label: 'FREQUENTLY ASKED QUESTIONS', href: '#faq' },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-[#F0D5D7] py-2'
            : 'bg-white/95 backdrop-blur-sm border-b border-[#F0D5D7]/60 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Brand Logo & Name */}
            <Link to="/rankers-meet" className="flex items-center space-x-2.5 sm:space-x-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white flex items-center justify-center p-1 border border-[#F0D5D7] shadow-sm group-hover:scale-105 transition-all duration-200 overflow-hidden flex-shrink-0">
                <img src="/images/yac-logo.png" alt={organization} className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-[9px] sm:text-xs font-black tracking-widest text-[#D91F2B] uppercase bg-[#FFF7F7] px-1.5 py-0.5 rounded border border-[#F0D5D7]">
                    {organization}
                  </span>
                </div>
                <span className="font-heading font-black text-sm sm:text-lg text-[#101522] tracking-tight block">
                  {eventName}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-7">
              <a href="#about" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#D91F2B] transition-colors">
                About
              </a>
              <a href="#schedule" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#D91F2B] transition-colors">
                Schedule
              </a>
              <a href="#eligibility" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#D91F2B] transition-colors">
                Who Can Attend
              </a>
              <a href="#highlights" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#D91F2B] transition-colors">
                Highlights
              </a>
              <a href="#venue" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#D91F2B] transition-colors">
                Venue
              </a>
              <a href="#faq" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#D91F2B] transition-colors">
                FAQ
              </a>
              <Link
                to="/admin/login"
                className="text-[11px] font-bold text-slate-500 hover:text-[#101522] flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 hover:border-[#F0D5D7] transition-all bg-white"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D91F2B]" />
                Admin Portal
              </Link>
            </div>

            {/* Desktop Action CTA Button */}
            <div className="hidden md:flex items-center space-x-3">
              {!isRegisterPage ? (
                isRegistrationOpen ? (
                  <Link
                    to="/rankers-meet/register"
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#D91F2B] hover:bg-[#B81724] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 group active:scale-95"
                  >
                    <Ticket className="w-3.5 h-3.5 mr-2 text-[#C89B3C]" />
                    Register Now
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    Registrations Closed
                  </span>
                )
              ) : (
                <Link
                  to="/rankers-meet"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  ← Back to Details
                </Link>
              )}
            </div>

            {/* Mobile Actions: Register pill + Hamburger toggle */}
            <div className="flex md:hidden items-center space-x-2">
              {!isRegisterPage && (
                isRegistrationOpen ? (
                  <Link
                    to="/rankers-meet/register"
                    className="text-[11px] font-black uppercase tracking-wider bg-[#D91F2B] active:bg-[#B81724] text-white px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <Ticket className="w-3 h-3 text-[#C89B3C]" />
                    Register
                  </Link>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg border border-slate-200">
                    Closed
                  </span>
                )
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-6 h-6 text-[#D91F2B]" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Navigation Overlay (Section 9 in Mobile Spec) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col justify-between pt-[env(safe-area-inset-top)] pb-[max(20px,env(safe-area-inset-bottom))] px-6 animate-in fade-in duration-200">
          {/* Top Bar inside Overlay */}
          <div className="flex items-center justify-between h-16 border-b border-[#F0D5D7]">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center p-1 border border-[#F0D5D7] shadow-xs">
                <img src="/images/yac-logo.png" alt={organization} className="w-full h-full object-contain" />
              </div>
              <span className="font-heading font-black text-base text-[#101522]">
                {eventName}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-600 hover:text-[#D91F2B] hover:bg-[#FFF7F7] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Staggered Navigation Links */}
          <div className="flex-1 py-8 flex flex-col justify-center space-y-4 overflow-y-auto">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between text-lg sm:text-xl font-heading font-black text-[#101522] hover:text-[#D91F2B] transition-colors py-2 border-b border-slate-100"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#D91F2B] group-hover:translate-x-1 transition-all" />
              </a>
            ))}

            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-[#101522] py-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#D91F2B]" />
              Staff & Admin Portal Login
            </Link>
          </div>

          {/* Bottom Register CTA in Mobile Overlay */}
          <div className="pt-4 border-t border-[#F0D5D7] space-y-3">
            {isRegistrationOpen ? (
              <Link
                to="/rankers-meet/register"
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center py-4 rounded-2xl bg-[#D91F2B] active:bg-[#B81724] text-white font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                <Ticket className="w-4 h-4 mr-2 text-[#C89B3C]" />
                Register for {eventName} →
              </Link>
            ) : (
              <div className="w-full text-center py-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                Registrations are currently closed
              </div>
            )}
            <p className="text-[11px] text-center text-slate-500">
              Free Admission &bull; 1 Parent Included &bull; Digital QR Pass
            </p>
          </div>
        </div>
      )}
    </>
  );
}
