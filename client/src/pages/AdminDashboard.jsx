import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useSocket } from '../context/SocketContext';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  UserCheck,
  Clock,
  Award,
  QrCode,
  Download,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  UserPlus,
  Loader2,
} from 'lucide-react';

const COLORS = ['#1D4ED8', '#059669', '#D97706', '#7C3AED', '#DC2626', '#0891B2'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState('');
  const { socket } = useSocket();

  const handleExport = async (format = 'csv') => {
    try {
      setExportLoading(true);
      const response = await api.get('/export/registrations', {
        params: { format },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: format === 'xlsx'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv;charset=utf-8;',
      });

      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `rankers_meet_attendees_${dateStr}.${format}`;
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to generate export file. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      setError('Failed to fetch live dashboard stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Listen for real-time check-in and registration events via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleCheckInSuccess = (attendee) => {
      setStats((prev) => {
        if (!prev) return prev;
        const newCheckedIn = prev.checkedIn + 1;
        const newPending = Math.max(0, prev.registered - newCheckedIn);
        const newPct = prev.registered > 0 ? Math.round((newCheckedIn / prev.registered) * 100) : 0;
        const newRecent = [attendee, ...(prev.recentCheckIns || [])].slice(0, 10);

        return {
          ...prev,
          checkedIn: newCheckedIn,
          pending: newPending,
          checkedInPercentage: newPct,
          checkedInGuests: prev.checkedInGuests + (attendee.numberOfGuests || 0),
          totalAttendanceEstimate: newCheckedIn + prev.checkedInGuests + (attendee.numberOfGuests || 0),
          recentCheckIns: newRecent,
        };
      });
    };

    const handleNewRegistration = () => {
      fetchStats();
    };

    socket.on('checkin:success', handleCheckInSuccess);
    socket.on('registration:new', handleNewRegistration);
    socket.on('checkin:undone', fetchStats);

    return () => {
      socket.off('checkin:success', handleCheckInSuccess);
      socket.off('registration:new', handleNewRegistration);
      socket.off('checkin:undone', fetchStats);
    };
  }, [socket]);

  // Chart Data preparation
  const examChartData = stats?.byExam?.map((item) => ({
    name: item.exam,
    attendees: item.count,
  })) || [];

  const classChartData = stats?.byClass?.map((item) => ({
    name: item.classCourse,
    value: item.count,
  })) || [];

  const overTimeData = stats?.overTime?.map((item) => ({
    date: item.date,
    registrations: item.count,
  })) || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Live Attendance Console
              </span>
              <span className="text-xs text-slate-400">&bull; Auto-synced via Socket.io</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-1">
              Event Overview & Statistics
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin/check-in"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow transition-all focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <QrCode className="w-4 h-4 mr-2 text-amber-300" />
              Launch QR Scanner
            </Link>
            <button
              onClick={() => handleExport('csv')}
              disabled={exportLoading}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50"
            >
              {exportLoading ? (
                <Loader2 className="w-4 h-4 mr-2 text-slate-500 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2 text-slate-500" />
              )}
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. MAIN STATISTICS CARDS (11-ADMIN-DASHBOARD.md) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Registered"
            value={stats ? stats.registered : '--'}
            subtitle={`Today: +${stats?.todayRegistrations || 0}`}
            icon={Users}
            color="blue"
            badge={<span className="text-blue-700 font-semibold">Official Passes</span>}
          />

          <StatCard
            title="Checked In"
            value={stats ? stats.checkedIn : '--'}
            subtitle={`${stats?.checkedInPercentage || 0}% of all registered`}
            icon={UserCheck}
            color="emerald"
            badge={<span className="text-emerald-700 font-bold">Admitted At Gates</span>}
          />

          <StatCard
            title="Pending"
            value={stats ? stats.pending : '--'}
            subtitle="Awaiting gate arrival"
            icon={Clock}
            color="amber"
            badge={<span className="text-amber-700 font-bold">Expected Arrivals</span>}
          />

          <StatCard
            title="Guest Count"
            value={stats ? stats.totalGuests : '--'}
            subtitle={`${stats?.checkedInGuests || 0} Guests Checked In`}
            icon={Award}
            color="purple"
            badge={<span className="text-purple-700 font-semibold">Total Accompaniments</span>}
          />
        </div>

        {/* 2. CHECK-IN PROGRESS (11-ADMIN-DASHBOARD.md) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900">
                Gate Check-in Progress
              </h2>
              <p className="text-xs text-slate-500">
                Live ratio of checked-in honorees vs total registrations
              </p>
            </div>
            <span className="font-heading font-black text-2xl text-blue-700">
              {stats?.checkedInPercentage || 0}%
            </span>
          </div>

          <div
            className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200"
            role="progressbar"
            aria-valuenow={stats?.checkedInPercentage || 0}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats?.checkedInPercentage || 0}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
            <span>0 Check-ins</span>
            <span>{stats?.checkedIn || 0} of {stats?.registered || 0} Admitted</span>
            <span>100% Target</span>
          </div>
        </div>

        {/* 3. RECHARTS ANALYTICS: 3 CHARTS (11-ADMIN-DASHBOARD.md) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Registrations Over Time */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Registrations Over Time
                </h3>
                <p className="text-xs text-slate-500">Daily registration activity</p>
              </div>
            </div>

            <div className="w-full h-64 mt-2">
              {overTimeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorRegs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                        border: 'none',
                      }}
                      formatter={(val) => [`${val} Registrations`, 'Count']}
                    />
                    <Area type="monotone" dataKey="registrations" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRegs)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No activity recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Registrations by Exam */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Registrations by Exam
                </h3>
                <p className="text-xs text-slate-500">Distribution by exam category</p>
              </div>
            </div>

            <div className="w-full h-64 mt-2">
              {examChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={examChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                        border: 'none',
                      }}
                      formatter={(val) => [`${val} Students`, 'Registrations']}
                    />
                    <Bar dataKey="attendees" fill="#1D4ED8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No exam data available.
                </div>
              )}
            </div>
          </div>

          {/* Chart 3: Registrations by Class / Course */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-emerald-600" />
                  Registrations by Class
                </h3>
                <p className="text-xs text-slate-500">Proportions by academic tier</p>
              </div>
            </div>

            <div className="w-full h-64 mt-2">
              {classChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={38}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {classChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                        border: 'none',
                      }}
                      formatter={(val) => [`${val} Students`, 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No class distribution data available.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. RECENT CHECK-INS LIVE FEED (11-ADMIN-DASHBOARD.md) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Recent Check-ins
              </h3>
              <p className="text-xs text-slate-500">
                Latest gate scans updated in real-time via Socket.IO
              </p>
            </div>
            <Link
              to="/admin/registrations"
              className="text-xs font-bold text-blue-700 hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
            >
              View Full Directory &rarr;
            </Link>
          </div>

          {stats?.recentCheckIns && stats.recentCheckIns.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {stats.recentCheckIns.map((attendee, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {attendee.studentName}
                      </p>
                      <p className="text-xs font-mono font-bold text-blue-700">
                        {attendee.registrationId}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Checked in
                    </span>
                    <span className="text-xs text-slate-500 font-mono block">
                      {attendee.checkedInAt
                        ? new Date(attendee.checkedInAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Just now'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400 text-xs">
              No check-ins recorded yet. As attendees scan their passes at the gate, they will appear here in real-time.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
