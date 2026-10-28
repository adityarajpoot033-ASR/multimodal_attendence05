"""
Session Management Routes for Multimodal Attendance & Engagement Agent.
Handles class session creation, session history, and session details.
"""

from flask import Blueprint, request, jsonify
from database import get_db_connection
from datetime import datetime

sessions_bp = Blueprint("sessions", __name__, url_prefix="/api/sessions")

@sessions_bp.route("", methods=["GET"])
def list_sessions():
    """Retrieve all class sessions with attendance counts and rates."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM sessions
        ORDER BY session_date DESC, start_time DESC
    """)
    rows = cursor.fetchall()
    sessions = []
    for r in rows:
        item = dict(r)
        total = item.get("total_registered") or 0
        present = item.get("present_count") or 0
        late = item.get("late_count") or 0
        effective_attended = present + late
        rate = round((effective_attended / total * 100), 1) if total > 0 else 0.0
        item["attendance_rate"] = rate
        sessions.append(item)
    conn.close()
    return jsonify({"success": True, "count": len(sessions), "sessions": sessions}), 200

@sessions_bp.route("/<int:session_id>", methods=["GET"])
def get_session(session_id):
    """Retrieve details of a single session."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sessions WHERE id = ?", (session_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "error": "Session not found"}), 404
    session_data = dict(row)
    conn.close()
    return jsonify({"success": True, "session": session_data}), 200

@sessions_bp.route("", methods=["POST"])
def create_session():
    """Create a new class session and initialize attendance records for enrolled students."""
    data = request.get_json() or {}
    required = ["course_name", "course_code", "room", "session_date", "start_time", "end_time"]
    for field in required:
        if not data.get(field):
            return jsonify({"success": False, "error": f"Field '{field}' is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Generate session code if not provided
    date_str = data["session_date"].replace("-", "")
    session_code = data.get("session_code") or f"{data['course_code'].strip().upper()}-{date_str}-{data['start_time'].replace(':', '')}"

    # Get student count
    cursor.execute("SELECT id FROM students WHERE status = 'active'")
    active_students = cursor.fetchall()
    total_active = len(active_students)

    cursor.execute("""
        INSERT INTO sessions (
            session_code, course_name, course_code, instructor_name,
            room, session_date, start_time, end_time, status, total_registered
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        session_code,
        data["course_name"].strip(),
        data["course_code"].strip().upper(),
        data.get("instructor_name", "Dr. Elena Vance").strip(),
        data["room"].strip(),
        data["session_date"].strip(),
        data["start_time"].strip(),
        data["end_time"].strip(),
        data.get("status", "in_progress"),
        total_active
    ))
    new_session_id = cursor.lastrowid

    # Automatically initialize blank/unmarked attendance records for all active students
    for st in active_students:
        cursor.execute("""
            INSERT INTO attendance_records (session_id, student_id, status, marked_method)
            VALUES (?, ?, 'unmarked', 'manual')
        """, (new_session_id, st["id"]))

    conn.commit()

    cursor.execute("SELECT * FROM sessions WHERE id = ?", (new_session_id,))
    created_session = dict(cursor.fetchone())
    conn.close()

    return jsonify({
        "success": True,
        "message": "Class session created successfully",
        "session": created_session
    }), 201

@sessions_bp.route("/<int:session_id>/status", methods=["PUT"])
def update_session_status(session_id):
    """Change session status between scheduled, in_progress, and completed."""
    data = request.get_json() or {}
    new_status = data.get("status")
    if new_status not in ["scheduled", "in_progress", "completed"]:
        return jsonify({"success": False, "error": "Invalid status"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE sessions SET status = ? WHERE id = ?", (new_status, session_id))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({"success": False, "error": "Session not found"}), 404
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": f"Session status updated to {new_status}"}), 200
