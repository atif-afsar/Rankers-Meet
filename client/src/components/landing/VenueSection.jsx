import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink, Calendar, Clock, Phone, Building } from 'lucide-react';

export default function VenueSection({
  venueName,
  venueAddress,
  dateString,
  timeString,
  mapUrl,
  helplinePhone,
}) {
  return (
    <section id="venue" className="relative py-20 bg-[#FFF7F7]/60 border-t border-b border-[#F0D5D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#D91F2B] bg-white border border-[#F0D5D7] px-3.5 py-1.5 rounded-full shadow-xs">
            Location & Logistics
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101522] mt-3 tracking-tight">
            How to Reach the <span className="font-serif italic font-normal text-[#D91F2B]">Venue</span>
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Centrally situated in Aligarh with dedicated attendee parking, valet support, and accessible ramps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Details Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-7 sm:p-9 border border-[#F0D5D7] shadow-card flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF7F7] border border-[#F0D5D7] flex items-center justify-center text-[#D91F2B] flex-shrink-0 shadow-sm">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#D91F2B]">
                    Ceremony Venue
                  </p>
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-[#101522] mt-0.5">
                    {venueName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {venueAddress}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#FFF7F7] border border-[#F0D5D7]">
                  <div className="flex items-center space-x-2 text-[#D91F2B] mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Date</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#101522]">{dateString}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF7F7] border border-[#F0D5D7]">
                  <div className="flex items-center space-x-2 text-[#D91F2B] mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Timing</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#101522]">{timeString}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <p className="font-bold text-[#101522] flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#D91F2B]" />
                  Key Landmarks & Transit
                </p>
                <p>• 10 mins from Aligarh Junction Railway Station</p>
                <p>• 5 mins from AMU Bab-e-Syed Gate / Medical College</p>
                <p>• Dedicated on-site parking for students & accompanying parents</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#D91F2B] hover:bg-[#B81724] text-white font-extrabold text-sm shadow-md transition-all group"
              >
                Get Directions on Google Maps
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {helplinePhone && (
                <a
                  href={`tel:${helplinePhone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center px-4 py-3 rounded-xl border border-[#F0D5D7] bg-white text-slate-700 hover:text-[#101522] font-bold text-xs hover:border-slate-300 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-[#D91F2B]" />
                  Venue Helpdesk: {helplinePhone}
                </a>
              )}
            </div>
          </div>

          {/* Right Visual Map Presentation */}
          <div className="lg:col-span-6 bg-[#101522] rounded-3xl p-6 sm:p-8 border border-slate-800 text-white flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient visual overlay */}
            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-[#D91F2B]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#D91F2B_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#C89B3C] bg-[#C89B3C]/10 px-3 py-1 rounded-full border border-[#C89B3C]/20 inline-block">
                Entry Gate Access
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
                Smooth & Swift Gate Check-in
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Dedicated reception desks with high-speed digital QR scanners will ensure you and your parent enter without delays.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#D91F2B] text-white flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <p className="text-xs text-slate-200">
                    Keep your <strong>digital QR pass</strong> open on your phone screen.
                  </p>
                </div>

                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#D91F2B] text-white flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <p className="text-xs text-slate-200">
                    Scan at <strong>Gate 1 (Student & Parent Entrance)</strong>.
                  </p>
                </div>

                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#D91F2B] text-white flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <p className="text-xs text-slate-200">
                    Receive your <strong>Felicitation Sash, Memento badge & Seating pass</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 text-center">
              <p className="text-[11px] text-slate-400">
                Doors open promptly at 09:30 AM IST. Refreshments served upon arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
