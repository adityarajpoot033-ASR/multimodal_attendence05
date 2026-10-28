import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  PlayCircle,
  CheckCircle,
  Download,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ClassSession } from '../types';

interface SessionsViewProps {
  sessions: ClassSession[];
  onCreateSession: (data: {
    course_name: string;
    course_code: string;
    room: string;
    session_date: string;
    start_time: string;
    end_time: string;
    instructor_name?: string;
  }) => Promise<void>;
  onUpdateSessionStatus: (id: number, status: 'scheduled' | 'in_progress' | 'completed') => Promise<void>;
  onSelectSessionToTakeAttendance: (sessionId: number) => void;
  onExportCsv: (sessionId: number) => void;
  isCreateModalOpen: boolean;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
}

export const SessionsView: React.FC<SessionsViewProps> = ({
  sessions,
  onCreateSession,
  onUpdateSessionStatus,
  onSelectSessionToTakeAttendance,
  onExportCsv,
  isCreateModalOpen,
  onOpenCreateModal,
  onCloseCreateModal,
}) => {
  const [courseName, setCourseName] = useState('Operating Systems & Concurrency');
  const [courseCode, setCourseCode] = useState('CS301');
  const [room, setRoom] = useState('Turing Hall 402');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [instructor, setInstructor] = useState('Dr. Elena Vance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await onCreateSession({
        course_name: courseName.trim(),
        course_code: courseCode.trim().toUpperCase(),
        room: room.trim(),
        session_date: sessionDate,
        start_time: startTime,
        end_time: endTime,
        instructor_name: instructor.trim(),
      });
      onCloseCreateModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <span>Course Schedules</span>
            <span aria-hidden="true">·</span>
            <span>{sessions.length} Recorded Sessions</span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-slate-900">Class &amp; Session History</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Track historical attendance registries, launch new lectures, and manage live session status.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Session</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sessions.map((sess) => {
          const isLive = sess.status === 'in_progress';
          const attended = (sess.present_count || 0) + (sess.late_count || 0);
          const total = sess.total_registered || 1;
          const rate = sess.attendance_rate || Math.round((attended / total) * 100);

          return (
            <div
              key={sess.id}
              className={`rounded-xl border bg-white p-5 shadow-xs flex flex-col justify-between transition-shadow hover:shadow-md ${
                isLive ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    {sess.course_code}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                    isLive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isLive ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Now
                      </>
                    ) : 'Completed'}
                  </span>
                </div>

                <h3 className="mt-2 text-sm font-bold text-slate-900 leading-snug">
                  {sess.course_name}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{sess.session_date}</span>
                    <span className="text-slate-300">·</span>
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{sess.start_time} - {sess.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{sess.room}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Turnout:</span>
                    <span className="font-bold text-slate-800">
                      {attended} / {total} ({rate}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        rate >= 80 ? 'bg-emerald-500' : rate >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(rate, 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{sess.present_count} Present</span>
                    <span>{sess.late_count} Late</span>
                    <span>{sess.absent_count} Absent</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onExportCsv(sess.id)}
                  title="Download session attendance CSV"
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {isLive ? (
                    <button
                      onClick={() => onUpdateSessionStatus(sess.id, 'completed')}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1"
                    >
                      End Class
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateSessionStatus(sess.id, 'in_progress')}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
                    >
                      Reopen
                    </button>
                  )}
                  <button
                    onClick={() => onSelectSessionToTakeAttendance(sess.id)}
                    className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    <span>Take Roster</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Session */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Create New Class Session</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Initializes a new attendance register with all currently enrolled students ready for checking.
            </p>

            {errorMsg && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitNew} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CS301"
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 font-mono focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Classroom / Hall *</label>
                  <input
                    type="text"
                    required
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Turing Hall 402"
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Course Name *</label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. Operating Systems & Concurrency"
                  className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Date *</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">End Time *</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Instructor Name</label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCloseCreateModal}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create & Launch Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
