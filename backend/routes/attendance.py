"""
Attendance Records and Manual Marking / Correction Routes.
Supports granular manual marking, status correction audit, and bulk actions.
"""

from flask import Blueprint, request, jsonify
from database import get_db_connection
from datetime import datetime

attendance_bp = Blueprint("attendance", __name__, url_prefix="/api/sessions/<int:session_id>/attendance")

def recalculate_session_counts(cursor, session_id):
    """Updates the cached aggregate counts on the session record."""
    cursor.execute("""
        SELECT
            SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_cnt,
            SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_cnt,
            SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late_cnt,
            SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excused_cnt,
            COUNT(id) as total_cnt
        FROM attendance_records
        WHERE session_id = ?
    """, (session_id,))
    row = cursor.fetchone()
    if row:
        cursor.execute("""
            UPDATE sessions
            SET present_count = ?, absent_count = ?, late_count = ?, excused_count = ?, total_registered = ?
            WHERE id = ?
        """, (row["present_cnt"] or 0, row["absent_cnt"] or 0, row["late_cnt"] or 0, row["excused_cnt"] or 0, row["total_cnt"] or 0, session_id))

@attendance_bp.route("", methods=["GET"])
def get_session_attendance(session_id):
    """Retrieve full attendance roster for a session with student metadata."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sessions WHERE id = ?", (session_id,))
    session_row = cursor.fetchone()
    if not session_row:
        conn.close()
        return jsonify({"success": False, "error": "Session not found"}), 404

    cursor.execute("""
        SELECT
            ar.id as record_id,
            ar.session_id,
            ar.student_id,
            ar.status,
            ar.marked_method,
            ar.confidence_score,
            ar.check_in_time,
            ar.remarks,
            ar.last_corrected_by,
            ar.last_corrected_at,
            s.full_name,
            s.student_id as student_code,
            s.roll_no,
            s.department,
            s.email,
            s.avatar_seed
        FROM attendance_records ar
        JOIN students s ON ar.student_id = s.id
        WHERE ar.session_id = ?
        ORDER BY s.roll_no ASC
    """, (session_id,))
    records = [dict(r) for r in cursor.fetchall()]

    # Also compute aggregate metrics
    total = len(records)
    present = sum(1 for r in records if r["status"] == "present")
    absent = sum(1 for r in records if r["status"] == "absent")
    late = sum(1 for r in records if r["status"] == "late")
    excused = sum(1 for r in records if r["status"] == "excused")
    unmarked = sum(1 for r in records if r["status"] == "unmarked")
    effective_attended = present + late
    pct = round((effective_attended / total * 100), 1) if total > 0 else 0.0

    conn.close()
    return jsonify({
        "success": True,
        "session": dict(session_row),
        "summary": {
            "total": total,
            "present": present,
            "absent": absent,
            "late": late,
            "excused": excused,
            "unmarked": unmarked,
            "attendance_percentage": pct
        },
        "records": records
    }), 200

@attendance_bp.route("/<int:student_id>", methods=["PUT"])
def update_student_attendance(session_id, student_id):
    """Update or correct a single student's attendance status with audit notes."""
    data = request.get_json() or {}
    new_status = data.get("status")
    allowed = ["present", "absent", "late", "excused", "unmarked"]
    if new_status not in allowed:
        return jsonify({"success": False, "error": f"Invalid status. Must be one of {allowed}"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    now_iso = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    check_in = now_iso if new_status in ["present", "late"] else None
    remarks = data.get("remarks")
    corrected_by = data.get("corrected_by", "Teacher")

    # Check if record exists
    cursor.execute("SELECT id, status FROM attendance_records WHERE session_id = ? AND student_id = ?", (session_id, student_id))
    existing = cursor.fetchone()

    if existing:
        cursor.execute("""
            UPDATE attendance_records
            SET status = ?,
                check_in_time = COALESCE(?, check_in_time),
                remarks = COALESCE(?, remarks),
                last_corrected_by = ?,
                last_corrected_at = ?
            WHERE session_id = ? AND student_id = ?
        """, (new_status, check_in, remarks, corrected_by, now_iso, session_id, student_id))
    else:
        cursor.execute("""
            INSERT INTO attendance_records (
                session_id, student_id, status, marked_method, check_in_time, remarks, last_corrected_by, last_corrected_at
            ) VALUES (?, ?, ?, 'manual', ?, ?, ?, ?)
        """, (session_id, student_id, new_status, check_in, remarks, corrected_by, now_iso))

    recalculate_session_counts(cursor, session_id)
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"Attendance updated to '{new_status}' successfully",
        "timestamp": now_iso
    }), 200

@attendance_bp.route("/bulk", methods=["POST"])
def bulk_update_attendance(session_id):
    """Bulk mark attendance (e.g. mark all present, mark unmarked absent)."""
    data = request.get_json() or {}
    action = data.get("action") # 'mark_all_present', 'mark_unmarked_absent', 'reset_unmarked', 'batch_update'
    now_iso = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_db_connection()
    cursor = conn.cursor()

    if action == "mark_all_present":
        cursor.execute("""
            UPDATE attendance_records
            SET status = 'present', check_in_time = ?, last_corrected_by = 'Teacher (Bulk)', last_corrected_at = ?
            WHERE session_id = ?
        """, (now_iso, now_iso, session_id))
    elif action == "mark_unmarked_absent":
        cursor.execute("""
            UPDATE attendance_records
            SET status = 'absent', last_corrected_by = 'Teacher (Bulk)', last_corrected_at = ?
            WHERE session_id = ? AND status = 'unmarked'
        """, (now_iso, session_id))
    elif action == "reset_unmarked":
        cursor.execute("""
            UPDATE attendance_records
            SET status = 'unmarked', check_in_time = NULL, last_corrected_by = 'Teacher (Reset)', last_corrected_at = ?
            WHERE session_id = ?
        """, (now_iso, session_id))
    elif action == "batch_update":
        items = data.get("records", [])
        for item in items:
            cursor.execute("""
                UPDATE attendance_records
                SET status = ?, remarks = COALESCE(?, remarks), last_corrected_by = 'Teacher (Batch)', last_corrected_at = ?
                WHERE session_id = ? AND student_id = ?
            """, (item["status"], item.get("remarks"), now_iso, session_id, item["student_id"]))
    else:
        conn.close()
        return jsonify({"success": False, "error": f"Unknown action '{action}'"}), 400

    recalculate_session_counts(cursor, session_id)
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": f"Bulk action '{action}' executed successfully"}), 200
