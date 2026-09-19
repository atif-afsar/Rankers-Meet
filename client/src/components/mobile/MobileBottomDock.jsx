import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, ArrowRight } from 'lucide-react';

export default function MobileBottomDock({
  isRegistrationOpen = true,
  eventName = 'Rankers Meet 2026',
}) {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  // Do not display on registration or ticket pages
  const isExcludedPage =
    location.pathname === '/rankers-meet/register' ||
    location.pathname.startsWith('/ticket') ||
    location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isExcludedPage) {
      setVisible(false);
      return;
    }

    const handleScroll = () => {
      // Show dock after scrolling past initial hero fold (~200px)
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      // Hide dock when reached bottom near final CTA or footer to avoid duplication
      const isNearBottom = scrollY + windowHeight >= docHeight - 320;

      if (scrollY > 180 && !isNearBottom) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExcludedPage]);

  if (isExcludedPage || !visible) return null;

  return (
    <aside
      aria-label="Mobile Registration Action"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-lg border-t border-[#F0D5D7] shadow-[0_-8px_25px_rgba(16,21,34,0.12)] transition-all duration-300 transform translate-y-0"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#D91F2B]">
            {eventName}
          </span>
          <span className="text-xs font-bold text-[#101522]">
            Free Entry &bull; 1 Parent Included
          </span>
        </div>

        {isRegistrationOpen ? (
          <Link
            to="/rankers-meet/register"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#D91F2B] active:bg-[#B81724] text-white font-extrabold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex-shrink-0"
          >
            <Ticket className="w-3.5 h-3.5 mr-1.5 text-[#C89B3C]" />
            Register Now
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        ) : (
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
            Closed
          </span>
        )}
      </div>
    </aside>
  );
}
