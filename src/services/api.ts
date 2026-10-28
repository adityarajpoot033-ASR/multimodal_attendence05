import { Student, ClassSession, AttendanceRecordWithStudent, AttendanceSummary, AnalyticsSummary, AttendanceStatus } from '../types';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Students
  async getStudents(search?: string, department?: string): Promise<{ success: boolean; students: Student[] }> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (department && department !== 'All') params.set('department', department);
    const res = await fetch(`/api/students?${params.toString()}`);
    return res.json();
  },

  async registerStudent(payload: {
    student_id: string;
    full_name: string;
    email: string;
    department: string;
    roll_no: string;
    enrollment_year?: number;
  }): Promise<{ success: boolean; student?: Student; error?: string }> {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async batchImportStudents(students: { full_name: string; roll_no: string; email?: string; department?: string }[]): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
    const res = await fetch('/api/students/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students }),
    });
    return res.json();
  },

  async updateStudent(id: number, payload: Partial<Student>): Promise<{ success: boolean; student?: Student; error?: string }> {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteStudent(id: number): Promise<{ success: boolean; error?: string }> {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Sessions
  async getSessions(): Promise<{ success: boolean; sessions: ClassSession[] }> {
    const res = await fetch('/api/sessions');
    return res.json();
  },

  async createSession(payload: {
    course_name: string;
    course_code: string;
    room: string;
    session_date: string;
    start_time: string;
    end_time: string;
    instructor_name?: string;
  }): Promise<{ success: boolean; session?: ClassSession; error?: string }> {
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async updateSessionStatus(id: number, status: 'scheduled' | 'in_progress' | 'completed'): Promise<{ success: boolean }> {
    const res = await fetch(`/api/sessions/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Attendance
  async getSessionAttendance(sessionId: number): Promise<{
    success: boolean;
    session: ClassSession;
    summary: AttendanceSummary;
    records: AttendanceRecordWithStudent[];
  }> {
    const res = await fetch(`/api/sessions/${sessionId}/attendance`);
    return res.json();
  },

  async updateRecord(
    sessionId: number,
    studentId: number,
    status: AttendanceStatus,
    remarks?: string
  ): Promise<{ success: boolean; record?: any }> {
    const res = await fetch(`/api/sessions/${sessionId}/attendance/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, remarks, corrected_by: 'Teacher' }),
    });
    return res.json();
  },

  async bulkUpdate(
    sessionId: number,
    action: 'mark_all_present' | 'mark_unmarked_absent' | 'reset_unmarked'
  ): Promise<{ success: boolean }> {
    const res = await fetch(`/api/sessions/${sessionId}/attendance/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<{ success: boolean } & AnalyticsSummary> {
    const res = await fetch('/api/analytics');
    return res.json();
  },

  // Reseed
  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/seed', { method: 'POST' });
    return res.json();
  },

  // CSV download helper
  downloadCsv(sessionId?: number) {
    const url = sessionId ? `/api/analytics/export/csv?session_id=${sessionId}` : '/api/analytics/export/csv';
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', sessionId ? `session_${sessionId}_attendance.csv` : 'attendance_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
