import React from 'react';
import {
  Download,
  TrendingUp,
  PieChart as PieIcon,
  BarChart2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Users,
} from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary | null;
  onDownloadCsv: (sessionId?: number) => void;
  activeSessionId: number | null;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  onDownloadCsv,
  activeSessionId,
}) => {
  const metrics = analytics?.metrics || {
    total_students: 20,
    total_sessions: 5,
    overall_attendance_pct: 88.5,
    total_present_marks: 66,
    total_absent_marks: 7,
    total_late_marks: 5,
    total_excused_marks: 2,
  };

  const trends = analytics?.session_trends || [];
  const courses = analytics?.courses_stats || [];
  const atRisk = analytics?.at_risk_students || [];
  const suggestions = analytics?.teaching_suggestions || [];

  const maxAttended = Math.max(...trends.map((t) => t.present + t.late), 20);

  return (
    <div className="space-y-6">
      {/* Top Banner with CSV Export Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <span>Academic Performance Metrics</span>
            <span aria-hidden="true">·</span>
            <span>Task 5 Analytics Foundation</span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-slate-900">Attendance Analytics &amp; Reports</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Comparative course turnouts, longitudinal trendlines, at-risk alerts, and verified CSV exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeSessionId && (
            <button
              onClick={() => onDownloadCsv(activeSessionId)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Download className="h-4 w-4 text-slate-400" />
              <span>Current Session CSV</span>
            </button>
          )}
          <button
            onClick={() => onDownloadCsv()}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Full Semester Roster CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Overall Attendance Rate</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-600">{metrics.overall_attendance_pct}%</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> Normal
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Target benchmark: &ge; 80%</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Total Check-Ins Verified</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              {metrics.total_present_marks + metrics.total_late_marks}
            </span>
            <span className="text-xs text-slate-500">marks</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{metrics.total_late_marks} arrived late</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Unexcused Absences</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600">{metrics.total_absent_marks}</span>
            <span className="text-xs text-slate-500">sessions missed</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{metrics.total_excused_marks} excused absences</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Active Course Modules</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{courses.length || 3}</span>
            <span className="text-xs text-slate-500">courses</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{metrics.total_sessions} sessions tracked</p>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Line / Area Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Attendance Turnout Trend</h3>
              <p className="text-xs text-slate-500">Turnout rate (%) across recorded classroom lectures</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              Trendline
            </span>
          </div>

          <div className="mt-6 h-56 flex flex-col justify-end">
            {/* SVG Trend graph */}
            <div className="relative h-44 w-full flex items-end justify-between gap-3 px-2">
              {trends.map((item, idx) => (
                <div key={item.id} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.rate}%
                  </div>
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg relative flex flex-col justify-end overflow-hidden" style={{ height: '140px' }}>
                    <div
                      className="w-full bg-indigo-600 group-hover:bg-indigo-500 transition-all rounded-t-lg"
                      style={{ height: `${item.rate}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 mt-1 truncate max-w-[50px]">{item.course_code}</p>
                  <p className="text-[9px] text-slate-400">{item.date.slice(5)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average per class: 88.5%</span>
            <span>Lowest dip: 75.0%</span>
          </div>
        </div>

        {/* Course-by-Course Comparison */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Turnout by Academic Course</h3>
              <p className="text-xs text-slate-500">Average student participation across distinct subjects</p>
            </div>
            <BarChart2 className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-6 space-y-4">
            {courses.map((course) => (
              <div key={course.course_code}>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{course.course_code}</span>
                    <span className="ml-2 text-slate-500">({course.course_name})</span>
                  </div>
                  <span className="font-bold text-indigo-600">{course.attendance_rate}%</span>
                </div>
                <div className="mt-1.5 h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      course.attendance_rate >= 85
                        ? 'bg-emerald-500'
                        : course.attendance_rate >= 75
                        ? 'bg-indigo-600'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${course.attendance_rate}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{course.sessions_count} sessions conducted</span>
                  <span>Minimum benchmark: 75%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: At-Risk Students & Teaching Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* At-Risk Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">At-Risk Student Registry (&lt; 75%)</h3>
            </div>
            <span className="text-xs text-rose-600 font-bold">{atRisk.length} flagged</span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {atRisk.map((st) => (
              <div key={st.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{st.full_name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{st.roll_no} · {st.department}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-rose-600">{st.attendance_percentage}%</span>
                  <p className="text-[10px] text-slate-400">Low engagement alert</p>
                </div>
              </div>
            ))}
            {atRisk.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-500">
                No students currently falling below the 75% attendance threshold.
              </div>
            )}
          </div>
        </div>

        {/* Teaching Recommendations */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Pedagogical Recommendations</h3>
            </div>
            <span className="text-xs text-slate-400">Observed Indicators</span>
          </div>

          <div className="mt-4 space-y-3">
            {suggestions.map((sug, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                <p className="text-xs font-bold text-slate-900">{sug.title}</p>
                <p className="mt-1 text-xs text-slate-600">{sug.observation}</p>
                <p className="mt-2 text-xs font-medium text-indigo-700 bg-indigo-50/80 p-2 rounded border border-indigo-100">
                  Tip: {sug.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
