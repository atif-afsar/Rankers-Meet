import React, { useState, useEffect } from 'react';
import api from '../api/client';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Megaphone,
  Users,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export default function AdminSettings() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [settings, setSettings] = useState({
    eventName: 'Rankers Meet 2026',
    tagline: 'Honoring The Commerce Champions of Yasir Ali Classes',
    organization: 'Yasir Ali Classes',
    eventDate: 'Saturday, October 3, 2026',
    eventTime: '10:00 AM - 02:00 PM IST',
    venue: 'Grand Auditorium, Aligarh Cultural Complex',
    address: 'Grand Bazaar, 1st Floor, Lal Diggi Road, Aligarh, UP 202002',
    mapUrl: 'https://maps.google.com/?q=Aligarh+Uttar+Pradesh',
    isRegistrationOpen: true,
    maxCapacity: 1200,
    announcement: 'Welcome to Rankers Meet 2026! Bring your digital QR ticket for swift entrance.',
    contactPhone: '+91 90454 17079',
    contactEmail: 'admissions@yasiraliclasses.in',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api.get('/settings');
        if (res.data.success && res.data.data) {
          setSettings(res.data.data);
        }
      } catch (err) {
        setErrorMsg('Failed to load event settings.');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleToggleRegistration = async (e) => {
    const checked = e.target.checked;
    setSettings((prev) => ({
      ...prev,
      isRegistrationOpen: checked,
      registrationOpen: checked,
    }));

    try {
      const res = await api.put('/settings', {
        ...settings,
        isRegistrationOpen: checked,
        registrationOpen: checked,
      });
      if (res.data?.success) {
        setSuccessMsg(
          checked
            ? 'Public registrations are now OPEN!'
            : 'Public registrations are now CLOSED!'
        );
        setTimeout(() => setSuccessMsg(''), 3500);
      }
    } catch (err) {
      setErrorMsg(
        'Failed to update registration status: ' +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/settings', settings);
      if (res.data.success) {
        setSuccessMsg('Event settings updated and synchronized across all portals successfully!');
        setSettings(res.data.data);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading event configuration...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
            Event Settings & Logistics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure dates, venue information, capacity limits, and registration status.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Registration Status Toggle Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Public Registration Status
              </h3>
              <p className="text-xs text-slate-500">
                Turn off to close public student registration when auditorium capacity is full.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isRegistrationOpen"
                checked={Boolean(settings.isRegistrationOpen)}
                onChange={handleToggleRegistration}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-3 text-xs font-bold text-slate-800">
                {settings.isRegistrationOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </label>
          </div>

          {/* Announcement Banner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Megaphone className="w-5 h-5 text-amber-500" />
              <h3 className="font-heading font-bold text-base text-slate-900">
                Landing Page Announcement Banner
              </h3>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Announcement Message
              </label>
              <input
                type="text"
                name="announcement"
                value={settings.announcement}
                onChange={handleChange}
                placeholder="Alert message displayed on top of the landing page..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>
          </div>

          {/* Event Details Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-heading font-bold text-base text-slate-900">
                General Event Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={settings.eventName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Organization Brand
                </label>
                <input
                  type="text"
                  name="organization"
                  value={settings.organization}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Event Date
                </label>
                <input
                  type="text"
                  name="eventDate"
                  value={settings.eventDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Event Timing
                </label>
                <input
                  type="text"
                  name="eventTime"
                  value={settings.eventTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  name="venue"
                  value={settings.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Full Venue Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  name="mapUrl"
                  value={settings.mapUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-8 py-3.5 rounded-xl font-black text-sm shadow-md transition-all bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2 text-amber-300" />
                  Save Event Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
