import React, { useState } from 'react';
import {
  FileCode,
  Terminal,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Server,
  Layers,
  ExternalLink,
} from 'lucide-react';

export const ApiDocsView: React.FC = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [testEndpoint, setTestEndpoint] = useState('/api/health');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const handleRunApiTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    try {
      const res = await fetch(testEndpoint);
      const data = await res.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResult(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const tasks = [
    { id: 1, title: 'Task 1 — Frontend and dashboard', status: 'Completed', desc: 'Roster, attendance table, session controls, responsive design, labelled demo data.' },
    { id: 2, title: 'Task 2 — Backend and storage', status: 'Completed', desc: 'API endpoints, student management, session records, attendance records, persistent database.' },
    { id: 3, title: 'Task 3 — Computer vision', status: 'Ready for Next Step', desc: 'Camera permissions, anonymous person detection, sustained-presence tracking, no face ID.' },
    { id: 4, title: 'Task 4 — Audio & engagement indicators', status: 'Ready for Next Step', desc: 'Microphone activity, movement/head-pose indicators, transparent estimated engagement scores.' },
    { id: 5, title: 'Task 5 — Analytics and recommendations', status: 'Completed', desc: 'Charts, attendance percentages, session comparisons, CSV export, teaching suggestions.' },
    { id: 6, title: 'Task 6 — Integration and deployment', status: 'Active & Verified', desc: 'Modular architecture, README and setup instructions, live dev server running.' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
          <span>Skillwallet Project Foundation</span>
          <span aria-hidden="true">·</span>
          <span>Technical Architecture</span>
        </div>
        <h1 className="mt-1 text-xl font-bold text-slate-900">
          Project Roadmap &amp; API Specifications
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
          Full compliance verification with Skillwallet requirements: Python Flask backend models, SQLite schemas, RESTful API endpoints, and React dashboard.
        </p>
      </div>

      {/* 6-Task Roadmap Tracker */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-indigo-600" />
          <span>6-Task Deliverable Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Task {task.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    task.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : task.status === 'Active & Verified'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-slate-900">{task.title}</h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{task.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive API Tester Console */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Live Interactive API Console</h3>
          </div>
          <span className="text-xs text-slate-400">Test backend REST responses in real-time</span>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            value={testEndpoint}
            onChange={(e) => setTestEndpoint(e.target.value)}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="/api/health">GET /api/health</option>
            <option value="/api/students">GET /api/students</option>
            <option value="/api/sessions">GET /api/sessions</option>
            <option value="/api/sessions/5/attendance">GET /api/sessions/5/attendance</option>
            <option value="/api/analytics">GET /api/analytics</option>
          </select>

          <button
            onClick={handleRunApiTest}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>{isLoading ? 'Executing...' : 'Send Request'}</span>
          </button>
        </div>

        {testResult && (
          <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-80">
            <pre>{testResult}</pre>
          </div>
        )}
      </div>

      {/* Python Flask Code Overview */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Skillwallet Python/Flask Code Files Included</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">requirements.txt &amp; SQLite Ready</span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <p className="font-mono font-bold text-slate-800">backend/app.py</p>
            <p className="text-slate-500 mt-0.5">Flask application factory, CORS setup, blueprint registrations, error handlers.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <p className="font-mono font-bold text-slate-800">backend/database.py</p>
            <p className="text-slate-500 mt-0.5">SQLite table definitions for students, sessions, attendance_records, engagement_indicators.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <p className="font-mono font-bold text-slate-800">backend/models.py</p>
            <p className="text-slate-500 mt-0.5">Python dataclasses with dictionary serialization and schema validations.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <p className="font-mono font-bold text-slate-800">backend/seed_data.py</p>
            <p className="text-slate-500 mt-0.5">Pre-populates 20 realistic student profiles, multiple class sessions, and attendance history.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <p className="font-mono font-bold text-slate-800">backend/routes/*.py</p>
            <p className="text-slate-500 mt-0.5">Modular Flask blueprints for students, sessions, attendance marking, and analytics.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <p className="font-mono font-bold text-slate-800">requirements.txt &amp; README.md</p>
            <p className="text-slate-500 mt-0.5">Complete submission documentation detailing dependencies and how to run on any machine.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
