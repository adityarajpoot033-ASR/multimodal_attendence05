export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'unmarked';

export interface Student {
  id: number;
  student_id: string;
  full_name: string;
  email: string;
  department: string;
  roll_no: string;
  enrollment_year: number;
  status: 'active' | 'inactive';
  avatar_seed?: string;
  attendance_percentage: number;
  created_at: string;
}

export interface ClassSession {
  id: number;
  session_code: string;
  course_name: string;
  course_code: string;
  instructor_name: string;
  room: string;
  session_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  total_registered: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  attendance_rate?: number;
  created_at: string;
}

export interface AttendanceRecordWithStudent {
  id: number;
  session_id: number;
  student_id: number;
  status: AttendanceStatus;
  marked_method: 'manual' | 'cv_detected' | 'hybrid';
  confidence_score: number;
  check_in_time: string | null;
  remarks: string | null;
  last_corrected_by: string | null;
  last_corrected_at: string | null;
  created_at: string;
  student_full_name: string;
  student_code: string;
  roll_no: string;
  department: string;
  email: string;
  avatar_seed?: string;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  unmarked: number;
  attendance_percentage: number;
}

export interface AnalyticsSummary {
  metrics: {
    total_students: number;
    total_sessions: number;
    overall_attendance_pct: number;
    total_present_marks: number;
    total_absent_marks: number;
    total_late_marks: number;
    total_excused_marks: number;
  };
  courses_stats: {
    course_code: string;
    course_name: string;
    sessions_count: number;
    attendance_rate: number;
  }[];
  session_trends: {
    id: number;
    session_code: string;
    course_code: string;
    date: string;
    present: number;
    absent: number;
    late: number;
    rate: number;
  }[];
  at_risk_students: (Student & { missed_sessions?: number })[];
  teaching_suggestions: {
    priority: 'high' | 'medium' | 'info';
    title: string;
    observation: string;
    recommendation: string;
  }[];
}
