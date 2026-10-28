import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  CalendarDays,
  BarChart3,
  Video,
  FileCode2,
  GraduationCap,
  Sparkles,
  Server,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'attendance' | 'students' | 'sessions' | 'analytics' | 'multimodal' | 'docs';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unmarkedCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, unmarkedCount = 0 }) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number; group?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Live Attendance', icon: ClipboardCheck, badge: unmarkedCount > 0 ? unmarkedCount : undefined },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'sessions', label: 'Class Sessions', icon: CalendarDays },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'multimodal', label: 'Vision & Audio Lab', icon: Video, group: 'Next Tasks' },
    { id: 'docs', label: 'Skillwallet Architecture', icon: FileCode2, group: 'System' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between min-h-screen">
      <div>
        {/* App Branding */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-slate-900">Faculty Portal</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Multimodal Attendance Agent</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Menu</p>
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="flex h-5 items-center justify-center px-1.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {item.badge} left
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 pb-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Multimodal & System</p>
          </div>

          {navItems.slice(5).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'multimodal' && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-100 text-indigo-700">
                    Lab
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer system status */}
      <div className="p-4 m-3 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 text-emerald-600" />
            Backend Engine
          </span>
          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">Active</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          SQLite Schema · Full-Stack REST API Ready
        </p>
        <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
          <span>Roadmap: Tasks 1–6</span>
          <span className="font-semibold text-indigo-600">Foundation Live</span>
        </div>
      </div>
    </aside>
  );
};
