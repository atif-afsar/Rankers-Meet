import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Award,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Ticket,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function TicketPage() {
  const { id } = useParams();
  const location = useLocation();
  const [ticketData, setTicketData] = useState(location.state?.registration || null);
  const [qrCode, setQrCode] = useState(location.state?.qrCode || null);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(!ticketData || !qrCode);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const isNew = location.state?.isNewRegistration;

  useEffect(() => {
    async function fetchTicket() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(`/tickets/${id}`);
        if (res.data.success) {
          setTicketData(res.data.ticket);
          setQrCode(res.data.ticket.qrCode);
          setEventDetails(res.data.ticket.event);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load ticket.');
      } finally {
        setLoading(false);
      }
    }

    if (!ticketData || !qrCode) {
      fetchTicket();
    } else {
      // Fetch event settings if not attached
      api.get('/settings').then((res) => {
        if (res.data.success) setEventDetails(res.data.data);
      });
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Rankers Meet 2026 Ticket - ${ticketData?.studentName}`,
        text: `Here is my official entry pass for Rankers Meet 2026 (${ticketData?.registrationId})`,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-600">Retrieving digital pass...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-black text-2xl text-slate-900 mb-2">
            Ticket Not Found
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            {error || 'We could not find a ticket associated with this Registration ID.'}
          </p>
          <Link
            to="/rankers-meet/register"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-700 text-white font-bold text-sm"
          >
            Register Here
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isCheckedIn = ticketData.status === 'CHECKED_IN';

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <div className="no-print">
        <Navbar />
      </div>

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
        {/* Success Banner (If newly registered) */}
        {isNew && (
          <div className="no-print mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-emerald-900 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading font-bold text-base text-emerald-950">
                Registration Successful!
              </h3>
              <p className="text-xs text-emerald-700 mt-1">
                Your admission pass has been registered under ID{' '}
                <strong className="font-bold underline">{ticketData.registrationId}</strong>. A confirmation email has been dispatched to {ticketData.email}.
              </p>
            </div>
          </div>
        )}

        {/* Action Controls Bar */}
        <div className="no-print flex items-center justify-between mb-6">
          <Link
            to="/rankers-meet"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            &larr; Back to Event
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <Download className="w-4 h-4 mr-1.5 text-blue-600" />
              Download Ticket
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Share2 className="w-4 h-4 mr-1.5 text-amber-300" />
              {copied ? 'Link Copied!' : 'Share Pass'}
            </button>
          </div>
        </div>

        {/* ================= OFFICIAL DIGITAL TICKET CARD ================= */}
        <div className="ticket-card bg-white rounded-3xl overflow-hidden border border-slate-300 shadow-ticket">
          {/* Ticket Header */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <Award className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                    Yasir Ali Classes Presents
                  </span>
                  <h1 className="font-heading font-black text-2xl text-white tracking-tight">
                    {eventDetails?.name || 'Rankers Meet 2026'}
                  </h1>
                </div>
              </div>

              {/* Status Pill */}
              <div>
                {isCheckedIn ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500 text-white shadow-sm tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> STATUS: CHECKED IN
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-blue-600 text-white shadow-sm tracking-wider">
                    <Ticket className="w-3.5 h-3.5 text-amber-300" /> STATUS: REGISTERED
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Student & ID Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Honoree Student
                </span>
                <h2 className="font-heading font-black text-2xl text-slate-900">
                  {ticketData.studentName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Parent: {ticketData.parentName} &bull; {ticketData.schoolCollege}
                </p>
              </div>

              <div className="text-left sm:text-right bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest block">
                  Registration ID
                </span>
                <span className="font-heading font-black text-2xl text-blue-900 tracking-wider">
                  {ticketData.registrationId}
                </span>
              </div>
            </div>

            {/* Examination & Rank Highlight */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">{ticketData.exam}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rank / Score</p>
                <p className="font-bold text-sm text-blue-700 mt-0.5">{ticketData.rank}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">{ticketData.classCourse}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parent Accompanying</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">
                  {Number(ticketData.numberOfGuests) === 1 ? '1 Parent' : 'Student Only'}
                </p>
              </div>
            </div>

            {/* QR Code Presentation */}
            <div className="text-center py-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
                {qrCode ? (
                  <img
                    src={qrCode}
                    alt="Digital Pass QR Code"
                    className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-slate-100 text-xs text-slate-400">
                    QR Code Unavailable
                  </div>
                )}
              </div>
              <p className="text-xs font-bold text-slate-700 mt-3">
                PRESENT THIS QR CODE AT ENTRANCE GATES
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Keep phone screen brightness high for instant scanning
              </p>
            </div>

            {/* Event Logistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Event Date</p>
                  <p className="text-slate-500">{eventDetails?.date || 'Saturday, October 3, 2026'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Timing</p>
                  <p className="text-slate-500">{eventDetails?.time || '10:00 AM - 02:00 PM IST'}</p>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">{eventDetails?.venue || 'Grand Auditorium, Aligarh Cultural Complex'}</p>
                  <p className="text-slate-500">{eventDetails?.address || 'Medical Road, Near AMU Circle, Aligarh'}</p>
                </div>
              </div>
            </div>

            {/* Check-in Notice / Timestamp if already checked in */}
            {isCheckedIn && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">Verified Entrance</span>
                </div>
                <span>
                  Checked In at{' '}
                  {new Date(ticketData.checkedInAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Ticket Footer Tear-off strip */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <span>Helpline: +91 88997 76655 &bull; info@yasiraliclasses.in</span>
            <span className="font-mono">Security Token Verified</span>
          </div>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}
