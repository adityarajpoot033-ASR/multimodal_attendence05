import React from 'react';
import { ClassSession } from '../types';
import { Calendar, Clock, Plus, RefreshCw, Radio, UserCheck } from 'lucide-react';

interface HeaderProps {
  sessions: ClassSession[];
  activeSessionId: number | null;
  onSelectSession: (id: number) => void;
  onOpenNewSessionModal: () => void;
  onResetDatabase: () => void;
  isResetting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onOpenNewSessionModal,
  onResetDatabase,
  isResetting,
}) => {
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        {/* Active Session Dropdown Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="session-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Current Class:
          </label>
          <div className="relative">
            <select
              id="session-select"
              value={activeSessionId || ''}
              onChange={(e) => onSelectSession(Number(e.target.value))}
              aria-label="Select class session"
              className="h-9 rounded-lg border border-slate-300 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {sessions.map((sess) => (
                <option key={sess.id} value={sess.id}>
                  {sess.course_code} · {sess.course_name.substring(0, 24)} ({sess.session_date})
                  {sess.status === 'in_progress' ? ' [LIVE]' : ''}
                </option>
              ))}
            </select>
          </div>
          {activeSession?.status === 'in_progress' && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Live Session
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Date & Time quiet indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 border-r border-slate-200 pr-4">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{dateFormatted}</span>
          <span className="text-slate-300">|</span>
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Academic Year 2024–2025 · Semester V</span>
        </div>

        {/* Action: New Session */}
        <button
          onClick={onOpenNewSessionModal}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Session</span>
        </button>

        {/* Action: Reset Records */}
        <button
          onClick={onResetDatabase}
          disabled={isResetting}
          title="Reset semester attendance ledger"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin text-indigo-600' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Reset Semester</span>
        </button>

        {/* Faculty profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-900 text-xs font-bold text-white shadow-xs">
            CS
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold leading-tight text-slate-900">Faculty Portal</p>
            <p className="text-[11px] text-slate-500 leading-tight">Dept. of Computer Science &amp; Eng.</p>
          </div>
        </div>
      </div>
    </header>
  );
};
