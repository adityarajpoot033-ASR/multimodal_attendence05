"""
Student Management Routes for Multimodal Attendance & Engagement Agent.
Handles registration, listing, updating, and deletion with schema validation.
"""

from flask import Blueprint, request, jsonify
from database import get_db_connection
from models import StudentModel
import re

students_bp = Blueprint("students", __name__, url_prefix="/api/students")

def validate_student_payload(data):
    errors = []
    if not data.get("full_name") or len(data["full_name"].strip()) < 2:
        errors.append("full_name must be at least 2 characters long")
    if not data.get("student_id") or not re.match(r"^[A-Za-z0-9\-_]{3,20}$", data["student_id"].strip()):
        errors.append("student_id must be 3-20 alphanumeric characters (hyphens allowed)")
    if not data.get("roll_no") or len(data["roll_no"].strip()) < 2:
        errors.append("roll_no is required")
    if not data.get("email") or "@" not in data["email"]:
        errors.append("valid email is required")
    if not data.get("department") or len(data["department"].strip()) < 2:
        errors.append("department is required")
    return errors

@students_bp.route("", methods=["GET"])
def list_students():
    """Retrieve all students with their overall attendance percentages."""
    conn = get_db_connection()
    cursor = conn.cursor()

    search = request.args.get("search", "").strip()
    dept = request.args.get("department", "").strip()

    query = """
        SELECT s.*,
            COUNT(ar.id) as total_sessions_recorded,
            SUM(CASE WHEN ar.status IN ('present', 'late') THEN 1 ELSE 0 END) as attended_sessions_count
        FROM students s
        LEFT JOIN attendance_records ar ON s.id = ar.student_id
        WHERE 1=1
    """
    params = []
    if search:
        query += " AND (s.full_name LIKE ? OR s.student_id LIKE ? OR s.roll_no LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
    if dept and dept != "All":
        query += " AND s.department = ?"
        params.append(dept)

    query += " GROUP BY s.id ORDER BY s.roll_no ASC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    students = []
    for r in rows:
        st = dict(r)
        total = st.get("total_sessions_recorded") or 0
        attended = st.get("attended_sessions_count") or 0
        rate = round((attended / total * 100), 1) if total > 0 else 100.0
        st["attendance_percentage"] = rate
        students.append(st)

    conn.close()
    return jsonify({"success": True, "count": len(students), "students": students}), 200

@students_bp.route("/<int:student_id>", methods=["GET"])
def get_student(student_id):
    """Retrieve a single student by ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return jsonify({"success": False, "error": f"Student with ID {student_id} not found"}), 404
    return jsonify({"success": True, "student": dict(row)}), 200

@students_bp.route("", methods=["POST"])
def register_student():
    """Register a new student."""
    data = request.get_json() or {}
    errors = validate_student_payload(data)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check for uniqueness
    cursor.execute("SELECT id FROM students WHERE student_id = ? OR email = ? OR roll_no = ?",
                   (data["student_id"], data["email"], data["roll_no"]))
    if cursor.fetchone():
        conn.close()
        return jsonify({"success": False, "error": "Student with this student_id, email, or roll_no already exists"}), 409

    avatar = data.get("avatar_seed") or data["full_name"].lower().replace(" ", "_")
    cursor.execute("""
        INSERT INTO students (student_id, full_name, email, department, roll_no, enrollment_year, status, avatar_seed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["student_id"].strip().upper(),
        data["full_name"].strip(),
        data["email"].strip().lower(),
        data["department"].strip(),
        data["roll_no"].strip().upper(),
        data.get("enrollment_year", 2024),
        data.get("status", "active"),
        avatar
    ))
    new_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT * FROM students WHERE id = ?", (new_id,))
    new_student = dict(cursor.fetchone())
    conn.close()

    return jsonify({"success": True, "message": "Student registered successfully", "student": new_student}), 201

@students_bp.route("/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    """Update student details."""
    data = request.get_json() or {}
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        return jsonify({"success": False, "error": "Student not found"}), 404

    cursor.execute("""
        UPDATE students
        SET full_name = ?, email = ?, department = ?, roll_no = ?, status = ?
        WHERE id = ?
    """, (
        data.get("full_name", existing["full_name"]),
        data.get("email", existing["email"]),
        data.get("department", existing["department"]),
        data.get("roll_no", existing["roll_no"]),
        data.get("status", existing["status"]),
        student_id
    ))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Student updated successfully"}), 200

@students_bp.route("/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    """Delete a student record and associated attendance history."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM students WHERE id = ?", (student_id,))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({"success": False, "error": "Student not found"}), 404
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Student record deleted successfully"}), 200
