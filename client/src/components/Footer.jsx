import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ExternalLink, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { EVENT_DATA } from '../data/eventData';

export default function Footer() {
  return (
    <footer className="bg-[#101522] text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Institute Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center p-1 border border-slate-700 shadow-md overflow-hidden">
                <img src="/images/yac-logo.png" alt="Yasir Ali Classes" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D91F2B] block">
                  Commerce Leaders
                </span>
                <span className="font-heading font-black text-lg text-white">
                  Yasir Ali Classes
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aligarh’s premier commerce coaching institute for Class 11–12, CA Foundation, CUET & Entrance exams. 16+ years of trusted mentorship and outstanding results.
            </p>
            <div>
              <a
                href={EVENT_DATA.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-bold text-[#D91F2B] hover:underline"
              >
                Visit Official Website <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>

          {/* Col 2: Event Quick Details */}
          <div>
            <h4 className="text-white font-black text-xs tracking-widest uppercase mb-4">
              Rankers Meet 2026
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>• Annual Grand Felicitation Ceremony</li>
              <li>• Trophy, Medal & Sash Presentation</li>
              <li>• Faculty & Career Roadmap Sessions</li>
              <li>• Parent Pride Stage Honors</li>
              <li>• Celebratory VIP Lunch Buffet</li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-white font-black text-xs tracking-widest uppercase mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About the Ceremony
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-white transition-colors">
                  Ceremony Schedule
                </a>
              </li>
              <li>
                <a href="#eligibility" className="hover:text-white transition-colors">
                  Who Can Attend
                </a>
              </li>
              <li>
                <a href="#venue" className="hover:text-white transition-colors">
                  Auditorium & Directions
                </a>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors flex items-center gap-1.5 text-[#D91F2B]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Helpdesk */}
          <div>
            <h4 className="text-white font-black text-xs tracking-widest uppercase mb-4">
              Helpdesk & Support
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#D91F2B] flex-shrink-0 mt-0.5" />
                <p>{EVENT_DATA.venueAddress}</p>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#D91F2B] flex-shrink-0" />
                <a href={`tel:${EVENT_DATA.helplinePhone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {EVENT_DATA.helplinePhone} / {EVENT_DATA.helplinePhoneAlt}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#D91F2B] flex-shrink-0" />
                <a href={`mailto:${EVENT_DATA.contactEmail}`} className="hover:text-white transition-colors">
                  {EVENT_DATA.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Yasir Ali Classes (YAC Edtech Pvt. Ltd.). All rights reserved.</p>
          <p>
            Rankers Meet 2026 Official Registration & Attendance Management System
          </p>
        </div>
      </div>
    </footer>
  );
}
