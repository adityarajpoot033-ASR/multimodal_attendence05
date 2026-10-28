import React, { useState } from 'react';
import {
  Search,
  Plus,
  Mail,
  GraduationCap,
  Trash2,
  Edit,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  FileSpreadsheet,
  Upload,
} from 'lucide-react';
import { Student } from '../types';

interface StudentDirectoryProps {
  students: Student[];
  onAddStudent: (data: {
    student_id: string;
    full_name: string;
    email: string;
    department: string;
    roll_no: string;
    enrollment_year: number;
  }) => Promise<void>;
  onBatchImport?: (students: { full_name: string; roll_no: string; email?: string; department?: string }[]) => Promise<void>;
  onUpdateStudent: (id: number, data: Partial<Student>) => Promise<void>;
  onDeleteStudent: (id: number) => Promise<void>;
  isAddModalOpen: boolean;
  onOpenAddModal: () => void;
  onCloseAddModal: () => void;
}

export const StudentDirectoryView: React.FC<StudentDirectoryProps> = ({
  students,
  onAddStudent,
  onBatchImport,
  onUpdateStudent,
  onDeleteStudent,
  isAddModalOpen,
  onOpenAddModal,
  onCloseAddModal,
}) => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchRawText, setBatchRawText] = useState(
`EN23CS301075, Rohit Chouhan, rohit.c@medicaps.ac.in, Computer Science & Engineering
EN23CS301076, Megha Patidar, megha.p@medicaps.ac.in, Computer Science & Engineering
EN23CS301077, Deepak Barve, deepak.b@medicaps.ac.in, Computer Science & Engineering
EN23CS301078, Sakshi Sharma, sakshi.s@medicaps.ac.in, Computer Science & Engineering`
  );

  // Form states for new student
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [rollNo, setRollNo] = useState('');
  const [enrollmentYear, setEnrollmentYear] = useState(2023);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Information Technology',
    'Artificial Intelligence',
  ];

  const filtered = students.filter((s) => {
    if (deptFilter !== 'All' && s.department !== deptFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.full_name.toLowerCase().includes(q) ||
        s.roll_no.toLowerCase().includes(q) ||
        s.student_id.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !studentId.trim() || !rollNo.trim() || !email.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddStudent({
        student_id: studentId.trim(),
        full_name: fullName.trim(),
        email: email.trim(),
        department,
        roll_no: rollNo.trim().toUpperCase(),
        enrollment_year: Number(enrollmentYear),
      });

      setStudentId('');
      setFullName('');
      setEmail('');
      setRollNo('');
      onCloseAddModal();
    } catch (err: any) {
      setFormError(err.message || 'Failed to register student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessBatch = async () => {
    if (!onBatchImport) return;
    setIsSubmitting(true);
    try {
      const lines = batchRawText.split('\n').filter((l) => l.trim().length > 0);
      const parsed = lines.map((line) => {
        const parts = line.split(',').map((p) => p.trim());
        return {
          roll_no: parts[0] || '',
          full_name: parts[1] || 'Student',
          email: parts[2] || `${(parts[0] || 'student').toLowerCase()}@medicaps.ac.in`,
          department: parts[3] || 'Computer Science & Engineering',
        };
      });

      await onBatchImport(parsed);
      setIsBatchModalOpen(false);
    } catch (err: any) {
      alert('Error importing batch: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setIsSubmitting(true);
    try {
      await onUpdateStudent(editingStudent.id, {
        full_name: editingStudent.full_name,
        email: editingStudent.email,
        department: editingStudent.department,
        roll_no: editingStudent.roll_no,
      });
      setEditingStudent(null);
    } catch (err: any) {
      alert('Failed to update student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <span>Academic Enrollment Roster</span>
            <span aria-hidden="true">·</span>
            <span>{students.length} Enrolled Students</span>
            <span aria-hidden="true">·</span>
            <span>Dept. of Computer Science &amp; Engineering</span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-slate-900">Student Directory</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Official department student directory, university roll numbers, and attendance eligibility.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {onBatchImport && (
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Upload className="h-4 w-4 text-slate-400" />
              <span>Paste Batch Roster</span>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number (e.g. EN23CS301072)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                  deptFilter === dept
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">University Roll No</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => {
                const initials = s.full_name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2);
                const isAtRisk = s.attendance_percentage < 75;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{s.full_name}</p>
                          <p className="text-[11px] text-slate-500">{s.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{s.roll_no}</td>

                    <td className="py-3 px-4 font-mono text-slate-500">{s.student_id}</td>

                    <td className="py-3 px-4 text-slate-600">{s.department}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isAtRisk ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {s.attendance_percentage}%
                        </span>
                        {isAtRisk && (
                          <span title="Below 75% university eligibility requirement" className="text-amber-500">
                            <AlertTriangle className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingStudent(s)}
                          title="Edit Student"
                          className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${s.full_name} (${s.roll_no}) from the roster?`)) {
                              onDeleteStudent(s.id);
                            }
                          }}
                          title="Delete Student"
                          className="p-1 rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Batch Import Students */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Batch Import Students</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Paste lines in CSV format: <code>Roll Number, Full Name, Email, Department</code>
            </p>

            <textarea
              rows={6}
              value={batchRawText}
              onChange={(e) => setBatchRawText(e.target.value)}
              className="mt-3 w-full rounded-lg border border-slate-300 p-3 font-mono text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />

            <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBatchModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessBatch}
                disabled={isSubmitting}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Importing...' : 'Import Students'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register Student */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Register New Student</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Enroll a student into the university database with institutional roll number.
            </p>

            {formError && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitNew} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">University Roll Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EN23CS301072"
                    value={rollNo}
                    onChange={(e) => {
                      setRollNo(e.target.value);
                      if (!studentId) setStudentId(`MU-${e.target.value.toUpperCase()}`);
                      if (!email) setEmail(`${e.target.value.toLowerCase()}@medicaps.ac.in`);
                    }}
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 font-mono focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Student ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MU-2023-072"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 font-mono focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">University Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="en23cs301072@medicaps.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Enrollment Year</label>
                  <input
                    type="number"
                    value={enrollmentYear}
                    onChange={(e) => setEnrollmentYear(Number(e.target.value))}
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCloseAddModal}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Edit Student Record</h2>
            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.full_name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, full_name: e.target.value })}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">University Roll Number</label>
                <input
                  type="text"
                  required
                  value={editingStudent.roll_no}
                  onChange={(e) => setEditingStudent({ ...editingStudent, roll_no: e.target.value.toUpperCase() })}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 font-mono focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">University Email</label>
                <input
                  type="email"
                  required
                  value={editingStudent.email}
                  onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Department</label>
                <select
                  value={editingStudent.department}
                  onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                </select>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
