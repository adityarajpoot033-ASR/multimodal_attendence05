import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      engine: 'Multimodal Attendance & Engagement Agent Full-Stack Engine',
      port: PORT,
      timestamp: new Date().toISOString(),
      tasks: {
        task1: 'Frontend & Dashboard (Active)',
        task2: 'Backend & Persistent Storage (Active)',
        task3: 'Computer Vision Lab (Ready)',
        task4: 'Audio & Engagement Lab (Ready)',
        task5: 'Analytics & Teaching Recommendations (Active)',
        task6: 'Deployment & Modular Submission Architecture (Ready)',
      },
    });
  });

  // Students
  app.get('/api/students', (req, res) => {
    const search = req.query.search as string | undefined;
    const department = req.query.department as string | undefined;
    const students = db.getStudents(search, department);
    res.json({ success: true, count: students.length, students });
  });

  app.post('/api/students', (req, res) => {
    const { student_id, full_name, email, department, roll_no, enrollment_year, avatar_seed } = req.body;
    if (!student_id || !full_name || !email || !department || !roll_no) {
      return res.status(400).json({ success: false, error: 'Missing required student fields' });
    }
    const student = db.addStudent({
      student_id: student_id.trim().toUpperCase(),
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      roll_no: roll_no.trim().toUpperCase(),
      enrollment_year: Number(enrollment_year) || 2024,
      status: 'active',
      avatar_seed: avatar_seed || full_name.trim().toLowerCase().replace(/\s+/g, '_'),
    });
    res.status(201).json({ success: true, message: 'Student registered successfully', student });
  });

  app.post('/api/students/batch', (req, res) => {
    const { students } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, error: 'Expected non-empty students array' });
    }
    const count = db.batchImportStudents(students);
    res.json({ success: true, count, message: `Successfully imported ${count} students into class roster.` });
  });

  app.put('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updated = db.updateStudent(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.json({ success: true, message: 'Student updated successfully', student: updated });
  });

  app.delete('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const ok = db.deleteStudent(id);
    if (!ok) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  });

  // Sessions
  app.get('/api/sessions', (req, res) => {
    const sessions = db.getSessions();
    res.json({ success: true, count: sessions.length, sessions });
  });

  app.get('/api/sessions/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const session = db.getSessionById(id);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, session });
  });

  app.post('/api/sessions', (req, res) => {
    const { course_name, course_code, room, session_date, start_time, end_time, instructor_name, session_code } = req.body;
    if (!course_name || !course_code || !room || !session_date || !start_time || !end_time) {
      return res.status(400).json({ success: false, error: 'Missing required session fields' });
    }
    const generatedCode = session_code || `${course_code.toUpperCase()}-${session_date.replace(/-/g, '')}-${start_time.replace(':', '')}`;
    const session = db.createSession({
      session_code: generatedCode,
      course_name: course_name.trim(),
      course_code: course_code.trim().toUpperCase(),
      instructor_name: (instructor_name || 'Dr. Elena Vance').trim(),
      room: room.trim(),
      session_date,
      start_time,
      end_time,
      status: 'in_progress',
    });
    res.status(201).json({ success: true, message: 'Class session created successfully', session });
  });

  app.put('/api/sessions/:id/status', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!['scheduled', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid session status' });
    }
    const updated = db.updateSessionStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, message: `Session status changed to ${status}`, session: updated });
  });

  // Attendance
  app.get('/api/sessions/:id/attendance', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = db.getSessionAttendance(id);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, ...result });
  });

  app.put('/api/sessions/:id/attendance/:studentId', (req, res) => {
    const sessionId = parseInt(req.params.id, 10);
    const studentId = parseInt(req.params.studentId, 10);
    const { status, remarks, corrected_by } = req.body;

    if (!['present', 'absent', 'late', 'excused', 'unmarked'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const updated = db.updateAttendanceRecord(sessionId, studentId, status, remarks, corrected_by || 'Teacher');
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Record could not be updated' });
    }
    res.json({ success: true, message: 'Attendance updated successfully', record: updated });
  });

  app.post('/api/sessions/:id/attendance/bulk', (req, res) => {
    const sessionId = parseInt(req.params.id, 10);
    const { action } = req.body;
    if (!['mark_all_present', 'mark_unmarked_absent', 'reset_unmarked'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid bulk action' });
    }
    db.bulkUpdateAttendance(sessionId, action);
    res.json({ success: true, message: `Bulk action '${action}' applied` });
  });

  // Analytics & CSV Export
  app.get('/api/analytics', (req, res) => {
    const analytics = db.getAnalytics();
    res.json({ success: true, ...analytics });
  });

  app.get('/api/analytics/export/csv', (req, res) => {
    const sessionId = req.query.session_id ? parseInt(req.query.session_id as string, 10) : undefined;
    const { filename, content } = db.exportCsv(sessionId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  });

  // Database reseed / reset
  app.post('/api/seed', (req, res) => {
    db.resetToDefault();
    res.json({ success: true, message: 'Database reset to default demo dataset successfully' });
  });

  // Vite Integration (Dev middleware)
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FullStack] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
