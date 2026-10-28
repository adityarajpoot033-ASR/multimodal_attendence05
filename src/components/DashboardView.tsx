import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock3,
  Percent,
  PlayCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { ClassSession, AnalyticsSummary, Student } from '../types';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  sessions: ClassSession[];
  activeSession: ClassSession | undefined;
  analytics: AnalyticsSummary | null;
  students: Student[];
  onNavigate: (tab: NavTab) => void;
  onOpenNewSession: () => void;
  onOpenNewStudent: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sessions,
  activeSession,
  analytics,
  students,
  onNavigate,
  onOpenNewSession,
  onOpenNewStudent,
}) => {
  const metrics = analytics?.metrics || {
    total_students: students.length,
    total_sessions: sessions.length,
    overall_attendance_pct: 88.5,
    total_present_marks: 66,
    total_absent_marks: 7,
    total_late_marks: 5,
    total_excused_marks: 2,
  };

  const presentCountToday = activeSession ? activeSession.present_count : metrics.total_present_marks;
  const absentCountToday = activeSession ? activeSession.absent_count : metrics.total_absent_marks;
  const lateCountToday = activeSession ? activeSession.late_count : metrics.total_late_marks;
  const totalRoster = activeSession ? activeSession.total_registered : metrics.total_students;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome with Quick Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
              <span>Department of Computer Science &amp; Engineering</span>
              <span aria-hidden="true">·</span>
              <span>Semester V</span>
              <span aria-hidden="true">·</span>
              <span>Academic Year 2024–2025</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Multimodal Attendance &amp; Engagement Agent
            </h1>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
              Real-time attendance registry, automated computer vision presence checks, student eligibility tracking, and official university CSV reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
            >
              <ClipboardCheckIcon className="h-4 w-4" />
              <span>Take Attendance</span>
            </button>
            <button
              onClick={onOpenNewSession}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Create Session</span>
            </button>
            <button
              onClick={onOpenNewStudent}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Users className="h-4 w-4 text-slate-400" />
              <span>Enroll Student</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Enrolled</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">{metrics.total_students}</span>
            <span className="text-xs text-slate-500">students</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Across 4 departments</span>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('students')} className="text-indigo-600 font-semibold hover:underline">
              View roster
            </button>
          </div>
        </div>

        {/* Present Today */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Present (Active / Today)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-emerald-600">{presentCountToday}</span>
            <span className="text-xs text-slate-500">of {totalRoster} marked</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="text-emerald-700 font-medium">+{lateCountToday} late checked-in</span>
            <span aria-hidden="true">·</span>
            <span>Manual & CV</span>
          </div>
        </div>

        {/* Absent */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Absent / Unmarked</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <UserX className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-rose-600">{absentCountToday}</span>
            <span className="text-xs text-slate-500">unexcused</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>{analytics?.metrics.total_excused_marks || 2} excused with slip</span>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('attendance')} className="text-indigo-600 font-semibold hover:underline">
              Review
            </button>
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Attendance</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-indigo-600">
              {metrics.overall_attendance_pct}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +2.4%
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Target: &ge; 85%</span>
            <span aria-hidden="true">·</span>
            <span>{sessions.length} sessions logged</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Live Session Status & At-Risk Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Class Session Card */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {activeSession?.course_code || 'CS301'}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{activeSession?.room || 'Turing Hall 402'}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {activeSession?.course_name || 'Operating Systems & Concurrency'}
              </h2>
            </div>

            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
              activeSession?.status === 'in_progress'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {activeSession?.status === 'in_progress' ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  In Progress
                </>
              ) : 'Completed'}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Date & Time</p>
              <p className="mt-0.5 text-xs font-bold text-slate-800">
                {activeSession?.session_date} · {activeSession?.start_time} - {activeSession?.end_time}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Instructor</p>
              <p className="mt-0.5 text-xs font-bold text-slate-800">
                {activeSession?.instructor_name || 'Dr. Elena Vance'}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Marked Attendance</p>
              <p className="mt-0.5 text-xs font-bold text-indigo-600">
                {((activeSession?.present_count || 0) + (activeSession?.late_count || 0))} / {activeSession?.total_registered || 20}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Session Rate</p>
              <p className="mt-0.5 text-xs font-bold text-slate-800">
                {activeSession?.attendance_rate || 75.0}%
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Doorway Scanner:</span>
              <span>Active</span>
              <span aria-hidden="true">·</span>
              <span>Manual overrides allowed</span>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>Open Attendance Sheet</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* At-Risk Students Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Attendance Alerts (&lt;75%)</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Threshold: 75%</span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Students falling below compulsory university eligibility criteria:
            </p>

            <div className="mt-4 space-y-3">
              {(analytics?.at_risk_students || []).slice(0, 3).map((stu) => (
                <div key={stu.id} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{stu.full_name}</p>
                    <p className="text-[11px] text-slate-500">{stu.roll_no} · {stu.department}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-600">{stu.attendance_percentage}%</span>
                    <p className="text-[10px] text-slate-500">{stu.missed_sessions || 2} missed</p>
                  </div>
                </div>
              ))}
              {(analytics?.at_risk_students || []).length === 0 && (
                <div className="flex items-center gap-2 p-3 text-xs text-emerald-700 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>All students currently meet the 75% attendance threshold.</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View full analytics report &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Teaching Suggestions Based on Multimodal Indicators (Task 5 Requirement) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Observed Multimodal Indicators &amp; Suggestions</h3>
              <p className="text-xs text-slate-500">Automated pedagogical insights generated from attendance trends and class engagement metrics</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('multimodal')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Launch Multimodal Lab &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(analytics?.teaching_suggestions || []).map((tip, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  tip.priority === 'high' ? 'text-amber-700' : tip.priority === 'medium' ? 'text-indigo-700' : 'text-emerald-700'
                }`}>
                  {tip.priority} priority observation
                </span>
                <h4 className="mt-1 text-xs font-bold text-slate-900">{tip.title}</h4>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{tip.observation}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-800">Suggestion:</p>
                <p className="mt-0.5 text-xs text-slate-500 italic">{tip.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function ClipboardCheckIcon(props: { className?: string }) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}
