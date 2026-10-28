import React, { useState } from 'react';
import {
  Check,
  X,
  Clock,
  ShieldCheck,
  Search,
  Download,
  CheckCheck,
  RefreshCw,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Edit2,
  Calendar,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { AttendanceRecordWithStudent, AttendanceStatus, ClassSession, AttendanceSummary } from '../types';

interface AttendanceSheetProps {
  session: ClassSession;
  summary: AttendanceSummary;
  records: AttendanceRecordWithStudent[];
  sessions: ClassSession[];
  onSelectSession: (id: number) => void;
  onUpdateStatus: (studentId: number, status: AttendanceStatus, remarks?: string) => Promise<void>;
  onBulkUpdate: (action: 'mark_all_present' | 'mark_unmarked_absent' | 'reset_unmarked') => Promise<void>;
  onExportCsv: () => void;
  isLoading: boolean;
}

export const AttendanceSheetView: React.FC<AttendanceSheetProps> = ({
  session,
  summary,
  records,
  sessions,
  onSelectSession,
  onUpdateStatus,
  onBulkUpdate,
  onExportCsv,
  isLoading,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeRemarkModal, setActiveRemarkModal] = useState<{
    studentId: number;
    studentName: string;
    currentRemarks: string;
    currentStatus: AttendanceStatus;
  } | null>(null);
  const [remarkText, setRemarkText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter records
  const filteredRecords = records.filter((rec) => {
    if (statusFilter !== 'all' && rec.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        rec.student_full_name.toLowerCase().includes(q) ||
        rec.roll_no.toLowerCase().includes(q) ||
        rec.student_code.toLowerCase().includes(q) ||
        rec.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenRemarks = (rec: AttendanceRecordWithStudent) => {
    setActiveRemarkModal({
      studentId: rec.student_id,
      studentName: rec.student_full_name,
      currentRemarks: rec.remarks || '',
      currentStatus: rec.status,
    });
    setRemarkText(rec.remarks || '');
  };

  const handleSaveRemarks = async () => {
    if (!activeRemarkModal) return;
    setIsUpdating(true);
    await onUpdateStatus(activeRemarkModal.studentId, activeRemarkModal.currentStatus, remarkText);
    setIsUpdating(false);
    setActiveRemarkModal(null);
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs"><Check className="h-3.5 w-3.5" /> Present</span>;
      case 'absent':
        return <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-xs"><X className="h-3.5 w-3.5" /> Absent</span>;
      case 'late':
        return <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-xs"><Clock className="h-3.5 w-3.5" /> Late</span>;
      case 'excused':
        return <span className="inline-flex items-center gap-1 text-sky-700 font-bold text-xs"><ShieldCheck className="h-3.5 w-3.5" /> Excused</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-slate-400 font-medium text-xs"><HelpCircle className="h-3.5 w-3.5" /> Unmarked</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Metadata Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
              <span>{session.course_code}</span>
              <span aria-hidden="true">·</span>
              <span>{session.room}</span>
              <span aria-hidden="true">·</span>
              <span>{session.session_date}</span>
              <span aria-hidden="true">·</span>
              <span>{session.start_time} - {session.end_time}</span>
            </div>
            <h1 className="mt-1 text-xl font-bold text-slate-900">
              {session.course_name}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Session Code: <span className="font-mono font-medium text-slate-700">{session.session_code}</span> · Instructor: {session.instructor_name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={session.id}
              onChange={(e) => onSelectSession(Number(e.target.value))}
              aria-label="Switch class session"
              className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.course_code} ({s.session_date}) - {s.status === 'in_progress' ? 'Live' : 'Archived'}
                </option>
              ))}
            </select>

            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Live Attendance Counters Bar */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-6 gap-3 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Enrolled</p>
            <p className="mt-1 text-xl font-extrabold text-slate-900">{summary.total}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Present</p>
            <p className="mt-1 text-xl font-extrabold text-emerald-700">{summary.present}</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Late</p>
            <p className="mt-1 text-xl font-extrabold text-amber-700">{summary.late}</p>
          </div>
          <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Absent</p>
            <p className="mt-1 text-xl font-extrabold text-rose-700">{summary.absent}</p>
          </div>
          <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Excused</p>
            <p className="mt-1 text-xl font-extrabold text-sky-700">{summary.excused}</p>
          </div>
          <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Attendance %</p>
            <p className="mt-1 text-xl font-extrabold text-indigo-700">{summary.attendance_percentage}%</p>
          </div>
        </div>
      </div>

      {/* Action Bar & Search / Filter Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search & Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, roll no, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Filter Segmented Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {['all', 'present', 'late', 'absent', 'excused', 'unmarked'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            onClick={() => onBulkUpdate('mark_all_present')}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors disabled:opacity-50"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={() => onBulkUpdate('mark_unmarked_absent')}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
            <span>Mark Unmarked Absent</span>
          </button>

          <button
            onClick={() => onBulkUpdate('reset_unmarked')}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Roster Attendance Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Manual / One-Click Action</th>
                <th className="py-3 px-4">Check-In / Audit Note</th>
                <th className="py-3 px-4 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec, index) => {
                const initials = rec.student_full_name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2);

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Index */}
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{index + 1}</td>

                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{rec.student_full_name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{rec.student_code}</p>
                        </div>
                      </div>
                    </td>

                    {/* Roll No */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{rec.roll_no}</td>

                    {/* Department */}
                    <td className="py-3 px-4 text-slate-600">{rec.department}</td>

                    {/* Current Status */}
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(rec.status)}
                    </td>

                    {/* Manual 1-Click Status Toggles */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onUpdateStatus(rec.student_id, 'present')}
                          title="Mark Present"
                          className={`p-1.5 rounded-md border text-xs font-semibold transition-colors ${
                            rec.status === 'present'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => onUpdateStatus(rec.student_id, 'late')}
                          title="Mark Late"
                          className={`p-1.5 rounded-md border text-xs font-semibold transition-colors ${
                            rec.status === 'late'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
                          }`}
                        >
                          <Clock className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => onUpdateStatus(rec.student_id, 'absent')}
                          title="Mark Absent"
                          className={`p-1.5 rounded-md border text-xs font-semibold transition-colors ${
                            rec.status === 'absent'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                          }`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => onUpdateStatus(rec.student_id, 'excused')}
                          title="Mark Excused"
                          className={`p-1.5 rounded-md border text-xs font-semibold transition-colors ${
                            rec.status === 'excused'
                              ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200'
                          }`}
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Timestamp & Audit */}
                    <td className="py-3 px-4">
                      {rec.check_in_time ? (
                        <div>
                          <p className="text-[11px] font-mono text-slate-700">
                            {rec.check_in_time.split(' ')[1] || rec.check_in_time}
                          </p>
                          {rec.last_corrected_by && (
                            <p className="text-[10px] text-slate-400 italic">
                              Corrected by {rec.last_corrected_by}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>

                    {/* Remarks Button */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenRemarks(rec)}
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                          rec.remarks
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span className="max-w-[120px] truncate text-left">
                          {rec.remarks ? rec.remarks : 'Add Note'}
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No students match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remarks / Correction Modal */}
      {activeRemarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Attendance Note &amp; Reason: {activeRemarkModal.studentName}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Provide justification or reason for status correction (e.g., Transit delay, Medical leave note, Lab pass).
            </p>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <div className="mt-1 flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() =>
                      setActiveRemarkModal({ ...activeRemarkModal, currentStatus: st })
                    }
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                      activeRemarkModal.currentStatus === st
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700">Note / Justification</label>
              <textarea
                rows={3}
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="e.g., Authorized doctor's note verified by Dean's Office."
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveRemarkModal(null)}
                className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRemarks}
                disabled={isUpdating}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save Correction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
