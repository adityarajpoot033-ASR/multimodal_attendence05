import fs from 'fs';
import path from 'path';

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
  attendance_percentage?: number;
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

export interface AttendanceRecord {
  id: number;
  session_id: number;
  student_id: number;
  status: 'present' | 'absent' | 'late' | 'excused' | 'unmarked';
  marked_method: 'manual' | 'cv_detected' | 'hybrid';
  confidence_score: number;
  check_in_time: string | null;
  remarks: string | null;
  last_corrected_by: string | null;
  last_corrected_at: string | null;
  created_at: string;
}

export interface EngagementIndicator {
  id: number;
  session_id: number;
  timestamp: string;
  sustained_presence_count: number;
  head_pose_attention_score: number;
  movement_activity_level: number;
  audio_activity_detected: boolean;
  composite_engagement_score: number;
  notes: string;
}

interface DatabaseSchema {
  students: Student[];
  sessions: ClassSession[];
  attendance_records: AttendanceRecord[];
  engagement_indicators: EngagementIndicator[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'attendance_database.json');

const INITIAL_REAL_STUDENTS: Omit<Student, 'id' | 'created_at'>[] = [
  { student_id: 'MU-2023-072', full_name: 'Aaditya Joshi', email: 'en23cs301072@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301072', enrollment_year: 2023, status: 'active', avatar_seed: 'aaditya' },
  { student_id: 'MU-2023-001', full_name: 'Aarav Sharma', email: 'en23cs301001@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301001', enrollment_year: 2023, status: 'active', avatar_seed: 'aarav' },
  { student_id: 'MU-2023-002', full_name: 'Priya Nair', email: 'en23cs301002@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301002', enrollment_year: 2023, status: 'active', avatar_seed: 'priya' },
  { student_id: 'MU-2023-003', full_name: 'Ananya Joshi', email: 'en23cs301003@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301003', enrollment_year: 2023, status: 'active', avatar_seed: 'ananya' },
  { student_id: 'MU-2023-004', full_name: 'Rohan Deshmukh', email: 'en23cs301004@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301004', enrollment_year: 2023, status: 'active', avatar_seed: 'rohan' },
  { student_id: 'MU-2023-005', full_name: 'Zara Patel', email: 'en23cs301005@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301005', enrollment_year: 2023, status: 'active', avatar_seed: 'zara' },
  { student_id: 'MU-2023-006', full_name: 'Harshvardhan Singh', email: 'en23cs301006@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301006', enrollment_year: 2023, status: 'active', avatar_seed: 'harsh' },
  { student_id: 'MU-2023-007', full_name: 'Sneha Agrawal', email: 'en23cs301007@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301007', enrollment_year: 2023, status: 'active', avatar_seed: 'sneha' },
  { student_id: 'MU-2023-008', full_name: 'Ayush Verma', email: 'en23cs301008@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301008', enrollment_year: 2023, status: 'active', avatar_seed: 'ayush' },
  { student_id: 'MU-2023-009', full_name: 'Ishaan Choudhary', email: 'en23cs301009@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301009', enrollment_year: 2023, status: 'active', avatar_seed: 'ishaan' },
  { student_id: 'MU-2023-010', full_name: 'Shreya Tiwari', email: 'en23cs301010@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301010', enrollment_year: 2023, status: 'active', avatar_seed: 'shreya' },
  { student_id: 'MU-2023-011', full_name: 'Yash Kulkarni', email: 'en23cs301011@medicaps.ac.in', department: 'Information Technology', roll_no: 'EN23IT302011', enrollment_year: 2023, status: 'active', avatar_seed: 'yash' },
  { student_id: 'MU-2023-012', full_name: 'Tanvi Gupta', email: 'en23cs301012@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301012', enrollment_year: 2023, status: 'active', avatar_seed: 'tanvi' },
  { student_id: 'MU-2023-013', full_name: 'Aditya Malhotra', email: 'en23cs301013@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301013', enrollment_year: 2023, status: 'active', avatar_seed: 'aditya' },
  { student_id: 'MU-2023-014', full_name: 'Riya Saxena', email: 'en23cs301014@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301014', enrollment_year: 2023, status: 'active', avatar_seed: 'riya' },
  { student_id: 'MU-2023-015', full_name: 'Siddharth Rao', email: 'en23cs301015@medicaps.ac.in', department: 'Artificial Intelligence', roll_no: 'EN23AI303015', enrollment_year: 2023, status: 'active', avatar_seed: 'siddharth' },
  { student_id: 'MU-2023-016', full_name: 'Mansi Jain', email: 'en23cs301016@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301016', enrollment_year: 2023, status: 'active', avatar_seed: 'mansi' },
  { student_id: 'MU-2023-017', full_name: 'Varun Mehta', email: 'en23cs301017@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301017', enrollment_year: 2023, status: 'active', avatar_seed: 'varun' },
  { student_id: 'MU-2023-018', full_name: 'Divya Mishra', email: 'en23cs301018@medicaps.ac.in', department: 'Information Technology', roll_no: 'EN23IT302018', enrollment_year: 2023, status: 'active', avatar_seed: 'divya' },
  { student_id: 'MU-2023-019', full_name: 'Pranav Dubey', email: 'en23cs301019@medicaps.ac.in', department: 'Computer Science & Engineering', roll_no: 'EN23CS301019', enrollment_year: 2023, status: 'active', avatar_seed: 'pranav' },
  { student_id: 'MU-2023-020', full_name: 'Pooja Yadav', email: 'en23cs301020@medicaps.ac.in', department: 'Artificial Intelligence', roll_no: 'EN23AI303020', enrollment_year: 2023, status: 'active', avatar_seed: 'pooja' },
];

function generateDefaultData(): DatabaseSchema {
  const now = new Date();
  const students: Student[] = INITIAL_REAL_STUDENTS.map((s, idx) => ({
    ...s,
    id: idx + 1,
    created_at: new Date(now.getTime() - 45 * 24 * 3600 * 1000).toISOString(),
  }));

  const formatDate = (daysAgo: number) => {
    const d = new Date(now.getTime() - daysAgo * 24 * 3600 * 1000);
    return d.toISOString().split('T')[0];
  };

  const sessions: ClassSession[] = [
    {
      id: 1,
      session_code: 'CS301-SEC-A-L1',
      course_name: 'Operating Systems & System Programming',
      course_code: 'CS301',
      instructor_name: 'Prof. Alok Sharma',
      room: 'Turing Hall 402',
      session_date: formatDate(6),
      start_time: '09:30',
      end_time: '10:30',
      status: 'completed',
      total_registered: 21,
      present_count: 19,
      absent_count: 1,
      late_count: 1,
      excused_count: 0,
      created_at: new Date(now.getTime() - 6 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 2,
      session_code: 'CS302-SEC-A-L1',
      course_name: 'Design & Analysis of Algorithms',
      course_code: 'CS302',
      instructor_name: 'Dr. Neha Verma',
      room: 'Lovelace Lab 108',
      session_date: formatDate(4),
      start_time: '11:00',
      end_time: '12:00',
      status: 'completed',
      total_registered: 21,
      present_count: 18,
      absent_count: 1,
      late_count: 2,
      excused_count: 0,
      created_at: new Date(now.getTime() - 4 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 3,
      session_code: 'CS303-SEC-A-L1',
      course_name: 'Database Management Systems',
      course_code: 'CS303',
      instructor_name: 'Prof. Alok Sharma',
      room: 'Ramanujan Hall 204',
      session_date: formatDate(2),
      start_time: '10:00',
      end_time: '11:00',
      status: 'completed',
      total_registered: 21,
      present_count: 20,
      absent_count: 0,
      late_count: 1,
      excused_count: 0,
      created_at: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 4,
      session_code: 'CS305-SEC-A-L1',
      course_name: 'Artificial Intelligence & Machine Learning',
      course_code: 'CS305',
      instructor_name: 'Dr. Sunita Kapoor',
      room: 'Aryabhata Auditorium',
      session_date: formatDate(1),
      start_time: '14:00',
      end_time: '15:30',
      status: 'completed',
      total_registered: 21,
      present_count: 17,
      absent_count: 2,
      late_count: 1,
      excused_count: 1,
      created_at: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 5,
      session_code: 'CS301-SEC-A-L2',
      course_name: 'Operating Systems & System Programming',
      course_code: 'CS301',
      instructor_name: 'Prof. Alok Sharma',
      room: 'Turing Hall 402',
      session_date: formatDate(0),
      start_time: '09:30',
      end_time: '10:30',
      status: 'in_progress', // Active current lecture
      total_registered: 21,
      present_count: 16,
      absent_count: 0,
      late_count: 2,
      excused_count: 1,
      created_at: now.toISOString(),
    },
  ];

  const attendance_records: AttendanceRecord[] = [];
  let recordId = 1;

  sessions.forEach((sess) => {
    students.forEach((stu, sIdx) => {
      let status: 'present' | 'absent' | 'late' | 'excused' | 'unmarked' = 'present';
      let remarks: string | null = null;
      let checkIn: string | null = `${sess.session_date} ${sess.start_time}:08`;

      if (sess.id === 5) {
        // Current active lecture
        if (stu.roll_no === 'EN23CS301072') {
          status = 'present';
          remarks = 'Doorway Presence Verified';
        } else if (sIdx < 14) {
          status = 'present';
          remarks = 'Doorway Presence Verified';
        } else if (sIdx === 14 || sIdx === 15) {
          status = 'late';
          remarks = 'Arrived 10 mins into lecture';
        } else if (sIdx === 16) {
          status = 'excused';
          remarks = 'College Sports Representation Approved';
          checkIn = null;
        } else {
          status = 'unmarked';
          checkIn = null;
        }
      } else {
        const hash = (sIdx * 13 + sess.id * 19) % 21;
        if (hash === 19) {
          status = 'absent';
          remarks = 'Unexcused Absence';
          checkIn = null;
        } else if (hash === 18) {
          status = 'late';
          remarks = 'Late check-in';
        } else if (hash === 17) {
          status = 'excused';
          remarks = 'Medical slip submitted';
          checkIn = null;
        } else {
          status = 'present';
          remarks = 'Present throughout lecture';
        }
      }

      attendance_records.push({
        id: recordId++,
        session_id: sess.id,
        student_id: stu.id,
        status,
        marked_method: 'manual',
        confidence_score: 1.0,
        check_in_time: checkIn,
        remarks,
        last_corrected_by: null,
        last_corrected_at: null,
        created_at: sess.created_at,
      });
    });
  });

  const engagement_indicators: EngagementIndicator[] = sessions.map((sess, idx) => ({
    id: idx + 1,
    session_id: sess.id,
    timestamp: sess.created_at,
    sustained_presence_count: sess.present_count,
    head_pose_attention_score: 85 + (idx % 3) * 3,
    movement_activity_level: 68 + (idx % 4) * 4,
    audio_activity_detected: idx % 2 === 0,
    composite_engagement_score: 82 + (idx % 3) * 5,
    notes: 'Active classroom participation and interactive question-answer session.',
  }));

  return { students, sessions, attendance_records, engagement_indicators };
}

class AttendanceDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Initializing database:', e);
    }
    const defaultData = generateDefaultData();
    this.persist(defaultData);
    return defaultData;
  }

  private persist(dataToSave: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  public resetToDefault(): DatabaseSchema {
    this.data = generateDefaultData();
    this.persist(this.data);
    return this.data;
  }

  // --- Students ---
  public getStudents(search?: string, department?: string): (Student & { attendance_percentage: number })[] {
    return this.data.students
      .filter((s) => {
        if (department && department !== 'All' && s.department !== department) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            s.full_name.toLowerCase().includes(q) ||
            s.student_id.toLowerCase().includes(q) ||
            s.roll_no.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .map((student) => {
        const records = this.data.attendance_records.filter(
          (r) => r.student_id === student.id && r.status !== 'unmarked'
        );
        const attended = records.filter((r) => r.status === 'present' || r.status === 'late').length;
        const total = records.length;
        const attendance_percentage = total > 0 ? Math.round((attended / total) * 1000) / 10 : 100.0;
        return { ...student, attendance_percentage };
      });
  }

  public getStudentById(id: number): Student | undefined {
    return this.data.students.find((s) => s.id === id);
  }

  public addStudent(payload: Omit<Student, 'id' | 'created_at'>): Student {
    const newId = this.data.students.length > 0 ? Math.max(...this.data.students.map((s) => s.id)) + 1 : 1;
    const newStudent: Student = {
      ...payload,
      id: newId,
      created_at: new Date().toISOString(),
    };
    this.data.students.push(newStudent);

    // Attach to active or scheduled sessions
    this.data.sessions.forEach((sess) => {
      if (sess.status === 'in_progress' || sess.status === 'scheduled') {
        const nextRecId = this.data.attendance_records.length + 1;
        this.data.attendance_records.push({
          id: nextRecId,
          session_id: sess.id,
          student_id: newId,
          status: 'unmarked',
          marked_method: 'manual',
          confidence_score: 1.0,
          check_in_time: null,
          remarks: null,
          last_corrected_by: null,
          last_corrected_at: null,
          created_at: new Date().toISOString(),
        });
        sess.total_registered += 1;
      }
    });

    this.persist(this.data);
    return newStudent;
  }

  public batchImportStudents(
    studentsList: { full_name: string; roll_no: string; email?: string; department?: string; student_id?: string }[]
  ): number {
    let importedCount = 0;
    studentsList.forEach((item) => {
      if (!item.full_name || !item.roll_no) return;
      const rollClean = item.roll_no.trim().toUpperCase();
      const exists = this.data.students.some((s) => s.roll_no === rollClean);
      if (!exists) {
        this.addStudent({
          student_id: item.student_id || `MU-${rollClean}`,
          full_name: item.full_name.trim(),
          email: item.email || `${rollClean.toLowerCase()}@medicaps.ac.in`,
          department: item.department || 'Computer Science & Engineering',
          roll_no: rollClean,
          enrollment_year: 2023,
          status: 'active',
          avatar_seed: item.full_name.toLowerCase().replace(/\s+/g, '_'),
        });
        importedCount += 1;
      }
    });
    return importedCount;
  }

  public updateStudent(id: number, updates: Partial<Student>): Student | null {
    const idx = this.data.students.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.students[idx] = { ...this.data.students[idx], ...updates };
    this.persist(this.data);
    return this.data.students[idx];
  }

  public deleteStudent(id: number): boolean {
    const prevLen = this.data.students.length;
    this.data.students = this.data.students.filter((s) => s.id !== id);
    if (this.data.students.length === prevLen) return false;
    this.data.attendance_records = this.data.attendance_records.filter((r) => r.student_id !== id);
    this.data.sessions.forEach((s) => this.recalculateSessionStats(s.id));
    this.persist(this.data);
    return true;
  }

  // --- Sessions ---
  public getSessions(): ClassSession[] {
    return this.data.sessions.map((sess) => {
      const effectiveAttended = (sess.present_count || 0) + (sess.late_count || 0);
      const total = sess.total_registered || 1;
      const rate = Math.round((effectiveAttended / total) * 1000) / 10;
      return { ...sess, attendance_rate: rate };
    });
  }

  public getSessionById(id: number): ClassSession | undefined {
    return this.getSessions().find((s) => s.id === id);
  }

  public createSession(
    payload: Omit<ClassSession, 'id' | 'created_at' | 'total_registered' | 'present_count' | 'absent_count' | 'late_count' | 'excused_count'>
  ): ClassSession {
    const newId = this.data.sessions.length > 0 ? Math.max(...this.data.sessions.map((s) => s.id)) + 1 : 1;
    const activeStudents = this.data.students.filter((s) => s.status === 'active');
    const newSession: ClassSession = {
      ...payload,
      id: newId,
      total_registered: activeStudents.length,
      present_count: 0,
      absent_count: 0,
      late_count: 0,
      excused_count: 0,
      status: payload.status || 'in_progress',
      created_at: new Date().toISOString(),
    };
    this.data.sessions.unshift(newSession);

    let nextRecId = this.data.attendance_records.length > 0 ? Math.max(...this.data.attendance_records.map((r) => r.id)) + 1 : 1;
    activeStudents.forEach((stu) => {
      this.data.attendance_records.push({
        id: nextRecId++,
        session_id: newId,
        student_id: stu.id,
        status: 'unmarked',
        marked_method: 'manual',
        confidence_score: 1.0,
        check_in_time: null,
        remarks: null,
        last_corrected_by: null,
        last_corrected_at: null,
        created_at: new Date().toISOString(),
      });
    });

    this.persist(this.data);
    return newSession;
  }

  public updateSessionStatus(id: number, status: 'scheduled' | 'in_progress' | 'completed'): ClassSession | null {
    const sess = this.data.sessions.find((s) => s.id === id);
    if (!sess) return null;
    sess.status = status;
    this.persist(this.data);
    return sess;
  }

  // --- Attendance ---
  public getSessionAttendance(sessionId: number) {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    const records = this.data.attendance_records
      .filter((r) => r.session_id === sessionId)
      .map((record) => {
        const student = this.data.students.find((s) => s.id === record.student_id);
        return {
          ...record,
          student_full_name: student?.full_name || 'Student',
          student_code: student?.student_id || '',
          roll_no: student?.roll_no || '',
          department: student?.department || '',
          email: student?.email || '',
          avatar_seed: student?.avatar_seed || 'student',
        };
      })
      .sort((a, b) => a.roll_no.localeCompare(b.roll_no));

    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const late = records.filter((r) => r.status === 'late').length;
    const excused = records.filter((r) => r.status === 'excused').length;
    const unmarked = records.filter((r) => r.status === 'unmarked').length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 1000) / 10 : 0.0;

    return {
      session,
      summary: { total, present, absent, late, excused, unmarked, attendance_percentage: rate },
      records,
    };
  }

  public updateAttendanceRecord(
    sessionId: number,
    studentId: number,
    status: 'present' | 'absent' | 'late' | 'excused' | 'unmarked',
    remarks?: string,
    correctedBy: string = 'Teacher'
  ): AttendanceRecord | null {
    let record = this.data.attendance_records.find(
      (r) => r.session_id === sessionId && r.student_id === studentId
    );
    const nowIso = new Date().toISOString();
    const checkIn = status === 'present' || status === 'late' ? nowIso : null;

    if (record) {
      record.status = status;
      record.remarks = remarks !== undefined ? remarks : record.remarks;
      record.check_in_time = checkIn || record.check_in_time;
      record.last_corrected_by = correctedBy;
      record.last_corrected_at = nowIso;
    } else {
      const nextId = this.data.attendance_records.length > 0 ? Math.max(...this.data.attendance_records.map((r) => r.id)) + 1 : 1;
      record = {
        id: nextId,
        session_id: sessionId,
        student_id: studentId,
        status,
        marked_method: 'manual',
        confidence_score: 1.0,
        check_in_time: checkIn,
        remarks: remarks || null,
        last_corrected_by: correctedBy,
        last_corrected_at: nowIso,
        created_at: nowIso,
      };
      this.data.attendance_records.push(record);
    }

    this.recalculateSessionStats(sessionId);
    this.persist(this.data);
    return record;
  }

  public bulkUpdateAttendance(
    sessionId: number,
    action: 'mark_all_present' | 'mark_unmarked_absent' | 'reset_unmarked'
  ): boolean {
    const sessionRecords = this.data.attendance_records.filter((r) => r.session_id === sessionId);
    const nowIso = new Date().toISOString();

    sessionRecords.forEach((r) => {
      if (action === 'mark_all_present') {
        r.status = 'present';
        r.check_in_time = r.check_in_time || nowIso;
        r.last_corrected_by = 'Teacher (Bulk)';
        r.last_corrected_at = nowIso;
      } else if (action === 'mark_unmarked_absent' && r.status === 'unmarked') {
        r.status = 'absent';
        r.last_corrected_by = 'Teacher (Bulk)';
        r.last_corrected_at = nowIso;
      } else if (action === 'reset_unmarked') {
        r.status = 'unmarked';
        r.check_in_time = null;
        r.last_corrected_by = 'Teacher (Reset)';
        r.last_corrected_at = nowIso;
      }
    });

    this.recalculateSessionStats(sessionId);
    this.persist(this.data);
    return true;
  }

  private recalculateSessionStats(sessionId: number) {
    const session = this.data.sessions.find((s) => s.id === sessionId);
    if (!session) return;
    const records = this.data.attendance_records.filter((r) => r.session_id === sessionId);
    session.total_registered = records.length;
    session.present_count = records.filter((r) => r.status === 'present').length;
    session.absent_count = records.filter((r) => r.status === 'absent').length;
    session.late_count = records.filter((r) => r.status === 'late').length;
    session.excused_count = records.filter((r) => r.status === 'excused').length;
  }

  // --- Analytics ---
  public getAnalytics() {
    const totalStudents = this.data.students.filter((s) => s.status === 'active').length;
    const totalSessions = this.data.sessions.length;

    const markedRecords = this.data.attendance_records.filter((r) => r.status !== 'unmarked');
    const presentMarks = markedRecords.filter((r) => r.status === 'present').length;
    const lateMarks = markedRecords.filter((r) => r.status === 'late').length;
    const absentMarks = markedRecords.filter((r) => r.status === 'absent').length;
    const excusedMarks = markedRecords.filter((r) => r.status === 'excused').length;
    const totalMarks = markedRecords.length;

    const overallPct = totalMarks > 0 ? Math.round(((presentMarks + lateMarks) / totalMarks) * 1000) / 10 : 0.0;

    const courseMap = new Map<string, { code: string; name: string; sessions: number; presentSum: number; regSum: number }>();
    this.data.sessions.forEach((s) => {
      const existing = courseMap.get(s.course_code) || {
        code: s.course_code,
        name: s.course_name,
        sessions: 0,
        presentSum: 0,
        regSum: 0,
      };
      existing.sessions += 1;
      existing.presentSum += (s.present_count || 0) + (s.late_count || 0);
      existing.regSum += s.total_registered || 1;
      courseMap.set(s.course_code, existing);
    });

    const coursesStats = Array.from(courseMap.values()).map((c) => ({
      course_code: c.code,
      course_name: c.name,
      sessions_count: c.sessions,
      attendance_rate: Math.round((c.presentSum / c.regSum) * 1000) / 10,
    }));

    const sessionTrends = this.data.sessions.map((s) => {
      const att = (s.present_count || 0) + (s.late_count || 0);
      const total = s.total_registered || 1;
      return {
        id: s.id,
        session_code: s.session_code,
        course_code: s.course_code,
        date: s.session_date,
        present: s.present_count,
        absent: s.absent_count,
        late: s.late_count,
        rate: Math.round((att / total) * 1000) / 10,
      };
    });

    const atRiskStudents = this.getStudents()
      .filter((s) => s.attendance_percentage < 75)
      .sort((a, b) => a.attendance_percentage - b.attendance_percentage);

    const teachingSuggestions = [
      {
        priority: 'high',
        title: 'Post-Lunch Attention In CS305 (AI/ML)',
        observation: 'Sustained presence and interaction dip slightly during theoretical probability units after 14:30.',
        recommendation: 'Incorporate a 5-minute live PyTorch notebook coding exercise at minute 40.',
      },
      {
        priority: 'medium',
        title: 'Punctuality Pattern in Ramanujan Hall 204',
        observation: 'Students arriving from CS Block A occasionally face 5-minute transit overlap.',
        recommendation: 'Allow a 5-minute architectural recap buffer before taking final attendance.',
      },
      {
        priority: 'info',
        title: 'Strong Engagement During Live Debugging',
        observation: 'Auditory responses and head-pose attention consistently peak at 89% during interactive code walkthroughs.',
        recommendation: 'Maintain interactive debugging drills throughout operating systems sessions.',
      },
    ];

    return {
      metrics: {
        total_students: totalStudents,
        total_sessions: totalSessions,
        overall_attendance_pct: overallPct,
        total_present_marks: presentMarks,
        total_absent_marks: absentMarks,
        total_late_marks: lateMarks,
        total_excused_marks: excusedMarks,
      },
      courses_stats: coursesStats,
      session_trends: sessionTrends,
      at_risk_students: atRiskStudents,
      teaching_suggestions: teachingSuggestions,
    };
  }

  // --- CSV Export ---
  public exportCsv(sessionId?: number): { filename: string; content: string } {
    if (sessionId) {
      const data = this.getSessionAttendance(sessionId);
      if (!data) return { filename: 'attendance_register.csv', content: '' };
      const lines: string[] = [];
      lines.push(`Institution,Department of Computer Science & Engineering`);
      lines.push(`Course Code,${data.session.course_code}`);
      lines.push(`Course Title,${data.session.course_name}`);
      lines.push(`Instructor,${data.session.instructor_name}`);
      lines.push(`Lecture Date,${data.session.session_date}`);
      lines.push(`Room,${data.session.room}`);
      lines.push('');
      lines.push('Roll Number,Student ID,Full Name,Department,Attendance Status,Check-in Time,Remarks,Verified By');

      data.records.forEach((r) => {
        const line = [
          `"${r.roll_no}"`,
          `"${r.student_code}"`,
          `"${r.student_full_name}"`,
          `"${r.department}"`,
          `"${r.status.toUpperCase()}"`,
          `"${r.check_in_time || 'N/A'}"`,
          `"${r.remarks || ''}"`,
          `"${r.last_corrected_by || 'Faculty Member'}"`,
        ].join(',');
        lines.push(line);
      });

      return { filename: `Attendance_${data.session.course_code}_${data.session.session_date}.csv`, content: lines.join('\n') };
    } else {
      const students = this.getStudents();
      const lines: string[] = [];
      lines.push('University Attendance Ledger - Semester Summary');
      lines.push('Roll Number,Student ID,Full Name,Department,Email,Attendance %');
      students.forEach((s) => {
        lines.push(`"${s.roll_no}","${s.student_id}","${s.full_name}","${s.department}","${s.email}","${s.attendance_percentage}%"`);
      });
      return { filename: 'University_Attendance_Semester_Summary.csv', content: lines.join('\n') };
    }
  }
}

export const db = new AttendanceDatabase();
