import React, { useState, useEffect } from 'react';
import api from '../api/client';
import AdminLayout from '../components/AdminLayout';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  UserCheck,
  RotateCcw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
  Mail,
  RefreshCw,
  QrCode,
  Clock,
  Calendar,
} from 'lucide-react';

export default function AdminAttendees() {
  const [registrations, setRegistrations] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [examFilter, setExamFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [emailFilter, setEmailFilter] = useState('all');
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [modalQr, setModalQr] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = async (format = 'csv', type = 'registrations') => {
    try {
      setExportLoading(true);
      const endpoint = type === 'history' ? '/export/checkin-history' : '/export/registrations';
      const params = type === 'history' ? { format } : {
        format,
        search,
        status: statusFilter,
        exam: examFilter,
        classCourse: classFilter,
        emailStatus: emailFilter,
      };

      const response = await api.get(endpoint, {
        params,
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: format === 'xlsx'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv;charset=utf-8;',
      });

      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = type === 'history'
        ? `rankers_meet_checkin_history_${dateStr}.${format}`
        : `rankers_meet_attendees_${dateStr}.${format}`;

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

  const fetchRegistrations = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
        search,
        status: statusFilter,
        exam: examFilter,
        classCourse: classFilter,
        emailStatus: emailFilter,
      };
      const res = await api.get('/registrations', { params });
      if (res.data.success) {
        setRegistrations(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch registrations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRegistrations(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, examFilter, classFilter, emailFilter]);

  const handleOpenAttendee = async (attendee) => {
    setSelectedAttendee(attendee);
    setModalQr('');
    setModalLoading(true);
    try {
      const res = await api.get(`/tickets/${attendee.registrationId}`);
      if (res.data?.success && res.data?.ticket?.qrCode) {
        setModalQr(res.data.ticket.qrCode);
      }
    } catch (e) {
      console.warn('Could not fetch ticket QR for modal', e);
    } finally {
      setModalLoading(false);
    }
  };

  const handleResendEmail = async (registrationId) => {
    try {
      setResendingId(registrationId);
      const res = await api.post(`/registrations/${registrationId}/resend-email`);
      if (res.data?.success) {
        alert(`Ticket confirmation email re-dispatched successfully (${res.data.data.emailStatus})!`);
        fetchRegistrations(pagination.page);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resend confirmation email.');
    } finally {
      setResendingId(null);
    }
  };

  const handleManualCheckIn = async (registrationId) => {
    try {
      setActionLoading(registrationId);
      const res = await api.post('/checkin', {
        registrationId,
        scannedBy: 'Admin Manual',
      });
      if (res.data.success) {
        fetchRegistrations(pagination.page);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Manual check-in failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUndoCheckIn = async (registrationId) => {
    if (!window.confirm(`Revert check-in for ${registrationId}?`)) return;
    try {
      setActionLoading(registrationId);
      const res = await api.post(`/checkin/undo/${registrationId}`);
      if (res.data.success) {
        fetchRegistrations(pagination.page);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to revert check-in');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
              Registration Table
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Total {pagination.total} registered attendees &bull; Search, verify, or export
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleExport('csv', 'registrations')}
              disabled={exportLoading}
              className="inline-flex items-center px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors disabled:opacity-50 min-h-[40px]"
              title="Download CSV respecting current search and filters"
            >
              {exportLoading ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin text-amber-300" />
              ) : (
                <Download className="w-4 h-4 mr-1.5 text-amber-300" />
              )}
              Export CSV
            </button>

            <button
              onClick={() => handleExport('xlsx', 'registrations')}
              disabled={exportLoading}
              className="inline-flex items-center px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition-colors disabled:opacity-50 min-h-[40px]"
              title="Download Excel spreadsheet respecting current filters"
            >
              {exportLoading ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin text-emerald-200" />
              ) : (
                <Download className="w-4 h-4 mr-1.5 text-emerald-200" />
              )}
              Export Excel (.xlsx)
            </button>

            <button
              onClick={() => handleExport('csv', 'history')}
              disabled={exportLoading}
              className="inline-flex items-center px-3.5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow transition-colors disabled:opacity-50 min-h-[40px]"
              title="Export gate check-in scan history"
            >
              <Clock className="w-4 h-4 mr-1.5 text-blue-200" />
              Check-in History
            </button>
          </div>
        </div>

        {/* Search and Filters Bar (11-ADMIN-DASHBOARD.md) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box: Student name, Registration ID, Mobile, Email */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, ID, mobile, or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          {/* Filter: Check-in status */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white font-medium text-slate-700"
            >
              <option value="all">All Check-in</option>
              <option value="REGISTERED">Pending Check-in</option>
              <option value="CHECKED_IN">Checked In</option>
            </select>
          </div>

          {/* Filter: Exam */}
          <div className="sm:col-span-2">
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white font-medium text-slate-700"
            >
              <option value="all">All Exams</option>
              <option value="CA Foundation (ICAI)">CA Foundation</option>
              <option value="Class 12th Board (CBSE / ISC / State)">Class 12th Boards</option>
              <option value="Class 11th Board / Entrance">Class 11th</option>
              <option value="AMU Entrance (B.Com / BBA / MBA / 11th Commerce)">AMU Entrance</option>
              <option value="CUET UG (Commerce / Accounts / Economics)">CUET UG</option>
              <option value="CUET PG / MBA Entrance">CUET PG / MBA</option>
              <option value="CMA / CS Foundation">CMA / CS</option>
              <option value="JMI Entrance (Commerce / Management)">JMI Entrance</option>
              <option value="Other Commerce Exam">Other Commerce Exam</option>
            </select>
          </div>

          {/* Filter: Class */}
          <div className="sm:col-span-2">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white font-medium text-slate-700"
            >
              <option value="all">All Courses</option>
              <option value="Class 12th Commerce">Class 12th Commerce</option>
              <option value="Class 11th Commerce">Class 11th Commerce</option>
              <option value="CA Foundation">CA Foundation</option>
              <option value="CMA Foundation / CSEET">CMA / CSEET</option>
              <option value="B.Com (Hons / General)">B.Com</option>
              <option value="CUET UG (Commerce)">CUET UG</option>
              <option value="CUET PG / MBA / M.Com">CUET PG / MBA</option>
              <option value="Junior Wing (Class 9-10 Commerce Foundation)">Junior Wing (Class 9-10)</option>
              <option value="Other Commerce Course">Other</option>
            </select>
          </div>

          {/* Filter: Email delivery */}
          <div className="sm:col-span-2">
            <select
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white font-medium text-slate-700"
            >
              <option value="all">All Emails</option>
              <option value="SENT">Sent</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {/* Attendees Table (11-ADMIN-DASHBOARD.md Columns) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-500">Loading attendee records...</p>
            </div>
          ) : registrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Registration ID</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Mobile</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Class</th>
                    <th className="py-3.5 px-4">Exam</th>
                    <th className="py-3.5 px-4">Rank</th>
                    <th className="py-3.5 px-4">Guests</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Registered At</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrations.map((item) => {
                    const isCheckedIn = item.status === 'CHECKED_IN';
                    const emailStatus = item.emailStatus || 'PENDING';

                    return (
                      <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Registration ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                          {item.registrationId}
                        </td>

                        {/* 2. Student */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{item.studentName}</p>
                          <p className="text-xs text-slate-400">Parent: {item.parentName}</p>
                        </td>

                        {/* 3. Mobile */}
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                          {item.mobileNumber}
                        </td>

                        {/* 4. Email */}
                        <td className="py-3.5 px-4 text-xs text-slate-600 truncate max-w-[130px]">
                          {item.email}
                        </td>

                        {/* 5. Class */}
                        <td className="py-3.5 px-4 text-xs text-slate-700 font-medium">
                          {item.classCourse}
                        </td>

                        {/* 6. Exam */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block bg-blue-50 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-200">
                            {item.exam}
                          </span>
                        </td>

                        {/* 7. Rank */}
                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-900">
                          {item.rank}
                        </td>

                        {/* 8. Guests */}
                        <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                          {item.numberOfGuests}
                        </td>

                        {/* 9. Status */}
                        <td className="py-3.5 px-4">
                          {isCheckedIn ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* 10. Registered At */}
                        <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                          {new Date(item.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        {/* 11. Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleOpenAttendee(item)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="View Registration Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleResendEmail(item.registrationId)}
                              disabled={resendingId === item.registrationId}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                              title="Resend Ticket Email"
                            >
                              {resendingId === item.registrationId ? (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                              ) : (
                                <Mail className="w-4 h-4" />
                              )}
                            </button>

                            {!isCheckedIn ? (
                              <button
                                disabled={actionLoading === item.registrationId}
                                onClick={() => handleManualCheckIn(item.registrationId)}
                                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
                              >
                                {actionLoading === item.registrationId ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5 mr-1" /> Check In
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                disabled={actionLoading === item.registrationId}
                                onClick={() => handleUndoCheckIn(item.registrationId)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Undo Check-in"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-sm">
              No attendees found matching your search or filters.
            </div>
          )}

          {/* Pagination Bar */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} attendees)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchRegistrations(pagination.page - 1)}
                  className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchRegistrations(pagination.page + 1)}
                  className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. REGISTRATION DETAILS MODAL (11-ADMIN-DASHBOARD.md) */}
        {selectedAttendee && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                    Registration Record
                  </span>
                  <h3 className="font-heading font-black text-2xl text-slate-900">
                    {selectedAttendee.studentName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAttendee(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              {/* QR Code Presentation in Modal */}
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 flex-shrink-0">
                  {modalLoading ? (
                    <div className="w-24 h-24 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  ) : modalQr ? (
                    <img src={modalQr} alt="QR Token" className="w-24 h-24 object-contain" />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center text-[10px] text-slate-400">
                      QR Token
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Digital QR Ticket Identifier
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official entrance QR pass assigned to Registration ID <strong className="font-mono text-blue-700">{selectedAttendee.registrationId}</strong>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Registration: {selectedAttendee.status || 'REGISTERED'}
                    </span>
                    {selectedAttendee.status === 'CHECKED_IN' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Check-in: CHECKED IN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        Check-in: PENDING
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* All Registration Fields */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Registration ID</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">{selectedAttendee.registrationId}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Student Full Name</span>
                  <span className="font-bold text-slate-800">{selectedAttendee.studentName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Parent / Guardian Name</span>
                  <span className="font-bold text-slate-800">{selectedAttendee.parentName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Mobile Number</span>
                  <span className="font-mono font-bold text-slate-800">{selectedAttendee.mobileNumber}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Email Address</span>
                  <span className="font-bold text-slate-800 break-all">{selectedAttendee.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Class / Course</span>
                  <span className="font-bold text-slate-800">{selectedAttendee.classCourse}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Exam & Rank</span>
                  <span className="font-bold text-blue-700">{selectedAttendee.exam} &bull; {selectedAttendee.rank}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">School / College</span>
                  <span className="font-bold text-slate-800">{selectedAttendee.schoolCollege}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Accompanying Guests</span>
                  <span className="font-bold text-slate-800">{selectedAttendee.numberOfGuests} Persons</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Registered At</span>
                  <span className="font-mono text-slate-700">
                    {new Date(selectedAttendee.createdAt).toLocaleString()}
                  </span>
                </div>
                {selectedAttendee.checkedInAt && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Check-in Time</span>
                    <span className="font-bold text-emerald-700">
                      {new Date(selectedAttendee.checkedInAt).toLocaleString()} ({selectedAttendee.checkedInBy || 'Gate Scanner'})
                    </span>
                  </div>
                )}
                {selectedAttendee.additionalInfo && (
                  <div className="pt-2">
                    <span className="text-slate-500 font-medium block mb-1">Additional Seating / Notes:</span>
                    <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
                      {selectedAttendee.additionalInfo}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`/rankers-meet/ticket/${selectedAttendee.registrationId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-700 hover:underline"
                >
                  Open Standalone Printable Pass &rarr;
                </a>
                <button
                  onClick={() => setSelectedAttendee(null)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
