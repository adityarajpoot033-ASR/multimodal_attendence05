import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AttendanceSheetView } from './components/AttendanceSheetView';
import { StudentDirectoryView } from './components/StudentDirectoryView';
import { SessionsView } from './components/SessionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { MultimodalLabView } from './components/MultimodalLabView';
import { ApiDocsView } from './components/ApiDocsView';
import { api } from './services/api';
import {
  Student,
  ClassSession,
  AttendanceRecordWithStudent,
  AttendanceSummary,
  AnalyticsSummary,
  AttendanceStatus,
} from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  // Active session attendance data
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecordWithStudent[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    unmarked: 0,
    attendance_percentage: 0,
  });

  // Loading & toast states
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch all primary data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [sessionsRes, studentsRes, analyticsRes] = await Promise.all([
        api.getSessions(),
        api.getStudents(),
        api.getAnalytics(),
      ]);

      if (sessionsRes.success && sessionsRes.sessions.length > 0) {
        setSessions(sessionsRes.sessions);
        // Find in-progress session or fallback to first
        const live = sessionsRes.sessions.find((s) => s.status === 'in_progress');
        const defaultId = live ? live.id : sessionsRes.sessions[0].id;
        setActiveSessionId(defaultId);
      }

      if (studentsRes.success) {
        setStudents(studentsRes.students);
      }

      if (analyticsRes.success) {
        setAnalytics(analyticsRes);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
      showToast('Error loading application data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch session attendance whenever activeSessionId changes
  const loadSessionAttendance = useCallback(async (sessionId: number) => {
    try {
      setIsAttendanceLoading(true);
      const res = await api.getSessionAttendance(sessionId);
      if (res.success) {
        setAttendanceRecords(res.records);
        setAttendanceSummary(res.summary);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setIsAttendanceLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeSessionId) {
      loadSessionAttendance(activeSessionId);
    }
  }, [activeSessionId, loadSessionAttendance]);

  // Attendance update handler
  const handleUpdateStatus = async (
    studentId: number,
    status: AttendanceStatus,
    remarks?: string
  ) => {
    if (!activeSessionId) return;
    try {
      // Optimistic update
      setAttendanceRecords((prev) =>
        prev.map((r) =>
          r.student_id === studentId
            ? {
                ...r,
                status,
                remarks: remarks !== undefined ? remarks : r.remarks,
                check_in_time:
                  status === 'present' || status === 'late'
                    ? new Date().toTimeString().split(' ')[0]
                    : null,
                last_corrected_by: 'Teacher',
              }
            : r
        )
      );

      await api.updateRecord(activeSessionId, studentId, status, remarks);
      // Refresh summary & analytics silently
      loadSessionAttendance(activeSessionId);
      api.getAnalytics().then((res) => {
        if (res.success) setAnalytics(res);
      });
      api.getSessions().then((res) => {
        if (res.success) setSessions(res.sessions);
      });
      showToast('Status updated successfully');
    } catch (err) {
      console.error('Failed to update attendance:', err);
      showToast('Failed to update status', 'error');
      if (activeSessionId) loadSessionAttendance(activeSessionId);
    }
  };

  // Bulk attendance update
  const handleBulkUpdate = async (
    action: 'mark_all_present' | 'mark_unmarked_absent' | 'reset_unmarked'
  ) => {
    if (!activeSessionId) return;
    try {
      setIsAttendanceLoading(true);
      await api.bulkUpdate(activeSessionId, action);
      await loadSessionAttendance(activeSessionId);
      const [sessRes, analRes] = await Promise.all([api.getSessions(), api.getAnalytics()]);
      if (sessRes.success) setSessions(sessRes.sessions);
      if (analRes.success) setAnalytics(analRes);
      showToast('Bulk update applied successfully');
    } catch (err) {
      showToast('Failed to perform bulk update', 'error');
    } finally {
      setIsAttendanceLoading(false);
    }
  };

  // Add new student
  const handleAddStudent = async (data: {
    student_id: string;
    full_name: string;
    email: string;
    department: string;
    roll_no: string;
    enrollment_year: number;
  }) => {
    const res = await api.registerStudent(data);
    if (!res.success) {
      throw new Error(res.error || 'Failed to register student');
    }
    showToast(`Student ${data.full_name} enrolled successfully!`);
    const [stRes, analRes] = await Promise.all([api.getStudents(), api.getAnalytics()]);
    if (stRes.success) setStudents(stRes.students);
    if (analRes.success) setAnalytics(analRes);
    if (activeSessionId) loadSessionAttendance(activeSessionId);
  };

  // Batch import students
  const handleBatchImport = async (batch: { full_name: string; roll_no: string; email?: string; department?: string }[]) => {
    const res = await api.batchImportStudents(batch);
    if (!res.success) throw new Error(res.error || 'Failed to import batch');
    showToast(`Successfully added ${res.count || batch.length} students to the roster!`);
    const [stRes, analRes] = await Promise.all([api.getStudents(), api.getAnalytics()]);
    if (stRes.success) setStudents(stRes.students);
    if (analRes.success) setAnalytics(analRes);
    if (activeSessionId) loadSessionAttendance(activeSessionId);
  };

  // Update student
  const handleUpdateStudent = async (id: number, data: Partial<Student>) => {
    const res = await api.updateStudent(id, data);
    if (!res.success) throw new Error(res.error || 'Failed to update student');
    showToast('Student profile updated');
    const stRes = await api.getStudents();
    if (stRes.success) setStudents(stRes.students);
  };

  // Delete student
  const handleDeleteStudent = async (id: number) => {
    const res = await api.deleteStudent(id);
    if (!res.success) throw new Error('Failed to delete student');
    showToast('Student removed from database');
    const [stRes, analRes] = await Promise.all([api.getStudents(), api.getAnalytics()]);
    if (stRes.success) setStudents(stRes.students);
    if (analRes.success) setAnalytics(analRes);
    if (activeSessionId) loadSessionAttendance(activeSessionId);
  };

  // Create session
  const handleCreateSession = async (data: {
    course_name: string;
    course_code: string;
    room: string;
    session_date: string;
    start_time: string;
    end_time: string;
    instructor_name?: string;
  }) => {
    const res = await api.createSession(data);
    if (!res.success || !res.session) {
      throw new Error(res.error || 'Failed to create session');
    }
    showToast(`Session ${res.session.course_code} launched!`);
    const [sessRes, analRes] = await Promise.all([api.getSessions(), api.getAnalytics()]);
    if (sessRes.success) setSessions(sessRes.sessions);
    if (analRes.success) setAnalytics(analRes);
    setActiveSessionId(res.session.id);
    setCurrentTab('attendance');
  };

  // Update session status
  const handleUpdateSessionStatus = async (
    id: number,
    status: 'scheduled' | 'in_progress' | 'completed'
  ) => {
    await api.updateSessionStatus(id, status);
    const sessRes = await api.getSessions();
    if (sessRes.success) setSessions(sessRes.sessions);
    showToast(`Session status updated to ${status}`);
  };

  // Reset database to demo state
  const handleResetDatabase = async () => {
    if (!confirm('Reset sample records to default demo state? Any manual edits will be reinitialized.')) {
      return;
    }
    setIsResetting(true);
    try {
      await api.resetDatabase();
      await loadData();
      showToast('Demo data re-seeded successfully');
    } catch (err) {
      showToast('Error resetting database', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Responsive Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unmarkedCount={attendanceSummary.unmarked}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onOpenNewSessionModal={() => setIsCreateSessionOpen(true)}
          onResetDatabase={handleResetDatabase}
          isResetting={isResetting}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center space-y-3">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-r-transparent"></div>
                <p className="text-xs font-semibold text-slate-500">Loading Skillwallet Attendance Agent...</p>
              </div>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  sessions={sessions}
                  activeSession={activeSession}
                  analytics={analytics}
                  students={students}
                  onNavigate={setCurrentTab}
                  onOpenNewSession={() => setIsCreateSessionOpen(true)}
                  onOpenNewStudent={() => setIsAddStudentOpen(true)}
                />
              )}

              {currentTab === 'attendance' && activeSession && (
                <AttendanceSheetView
                  session={activeSession}
                  summary={attendanceSummary}
                  records={attendanceRecords}
                  sessions={sessions}
                  onSelectSession={setActiveSessionId}
                  onUpdateStatus={handleUpdateStatus}
                  onBulkUpdate={handleBulkUpdate}
                  onExportCsv={() => api.downloadCsv(activeSession.id)}
                  isLoading={isAttendanceLoading}
                />
              )}

              {currentTab === 'students' && (
                <StudentDirectoryView
                  students={students}
                  onAddStudent={handleAddStudent}
                  onBatchImport={handleBatchImport}
                  onUpdateStudent={handleUpdateStudent}
                  onDeleteStudent={handleDeleteStudent}
                  isAddModalOpen={isAddStudentOpen}
                  onOpenAddModal={() => setIsAddStudentOpen(true)}
                  onCloseAddModal={() => setIsAddStudentOpen(false)}
                />
              )}

              {currentTab === 'sessions' && (
                <SessionsView
                  sessions={sessions}
                  onCreateSession={handleCreateSession}
                  onUpdateSessionStatus={handleUpdateSessionStatus}
                  onSelectSessionToTakeAttendance={(sId) => {
                    setActiveSessionId(sId);
                    setCurrentTab('attendance');
                  }}
                  onExportCsv={(sId) => api.downloadCsv(sId)}
                  isCreateModalOpen={isCreateSessionOpen}
                  onOpenCreateModal={() => setIsCreateSessionOpen(true)}
                  onCloseCreateModal={() => setIsCreateSessionOpen(false)}
                />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsView
                  analytics={analytics}
                  onDownloadCsv={(sId) => api.downloadCsv(sId)}
                  activeSessionId={activeSessionId}
                />
              )}

              {currentTab === 'multimodal' && (
                <MultimodalLabView
                  students={students}
                  activeSession={activeSession}
                  onSyncPresence={async (studentId, remarks) => {
                    await handleUpdateStatus(studentId, 'present', remarks);
                  }}
                />
              )}

              {currentTab === 'docs' && <ApiDocsView />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
