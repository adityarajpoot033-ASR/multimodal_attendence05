"""
Seed realistic demo data into SQLite database for Multimodal Attendance & Engagement Agent.
Provides labelled demo data for immediate testing and presentation.
"""

from datetime import datetime, timedelta
from database import get_db_connection, init_db

SAMPLE_STUDENTS = [
    {"student_id": "STU-2024-001", "full_name": "Aarav Sharma", "email": "aarav.sharma@campus.edu", "department": "Computer Science & Eng.", "roll_no": "CS21B001", "avatar": "aarav"},
    {"student_id": "STU-2024-002", "full_name": "Priya Nair", "email": "priya.nair@campus.edu", "department": "Computer Science & Eng.", "roll_no": "CS21B002", "avatar": "priya"},
    {"student_id": "STU-2024-003", "full_name": "Marcus Chen", "email": "marcus.chen@campus.edu", "department": "Software Engineering", "roll_no": "SE21B014", "avatar": "marcus"},
    {"student_id": "STU-2024-004", "full_name": "Sofia Rodriguez", "email": "sofia.r@campus.edu", "department": "Artificial Intelligence", "roll_no": "AI22B005", "avatar": "sofia"},
    {"student_id": "STU-2024-005", "full_name": "Rohan Deshmukh", "email": "rohan.d@campus.edu", "department": "Computer Science & Eng.", "roll_no": "CS21B019", "avatar": "rohan"},
    {"student_id": "STU-2024-006", "full_name": "Amina Al-Mansoor", "email": "amina.m@campus.edu", "department": "Data Science", "roll_no": "DS22B008", "avatar": "amina"},
    {"student_id": "STU-2024-007", "full_name": "Liam Gallagher", "email": "liam.g@campus.edu", "department": "Computer Science & Eng.", "roll_no": "CS21B027", "avatar": "liam"},
    {"student_id": "STU-2024-008", "full_name": "Ananya Joshi", "email": "ananya.j@campus.edu", "department": "Software Engineering", "roll_no": "SE21B022", "avatar": "ananya"},
    {"student_id": "STU-2024-009", "full_name": "Kenji Takahashi", "email": "kenji.t@campus.edu", "department": "Artificial Intelligence", "roll_no": "AI22B011", "avatar": "kenji"},
    {"student_id": "STU-2024-010", "full_name": "Zara Patel", "email": "zara.p@campus.edu", "department": "Computer Science & Eng.", "roll_no": "CS21B033", "avatar": "zara"},
    {"student_id": "STU-2024-011", "full_name": "David O'Connor", "email": "david.oc@campus.edu", "department": "Data Science", "roll_no": "DS22B015", "avatar": "david"},
    {"student_id": "STU-2024-012", "full_name": "Fatima Zahra", "email": "fatima.z@campus.edu", "department": "Computer Science & Eng.", "roll_no": "CS21B041", "avatar": "fatima"},
    {"student_id": "STU-2024-013", "full_name": "Ethan Wright", "email": "ethan.w@campus.edu", "department": "Software Engineering", "roll_no": "SE21B039", "avatar": "ethan"},
    {"student_id": "STU-2024-014", "full_name": "Kavita Verma", "email": "kavita.v@campus.edu", "department": "Artificial Intelligence", "roll_no": "AI22B018", "avatar": "kavita"},
    {"student_id": "STU-2024-015", "full_name": "Lucas Silva", "email": "lucas.s@campus.edu", "department": "Computer Science & Eng.", "roll_no": "CS21B048", "avatar": "lucas"},
    {"student_id": "STU-2024-016", "full_name": "Mei-Ling Zhou", "email": "meiling.z@campus.edu", "department": "Data Science", "roll_no": "DS22B024", "avatar": "meiling"},
    {"student_id": "STU-2024-017", "full_name": "Tariq Mahmood", "email": "tariq.m@campus.edu", "department": "Computer Science & Eng.", "roll_no": "CS21B052", "avatar": "tariq"},
    {"student_id": "STU-2024-018", "full_name": "Chloe Dubois", "email": "chloe.d@campus.edu", "department": "Software Engineering", "roll_no": "SE21B044", "avatar": "chloe"},
    {"student_id": "STU-2024-019", "full_name": "Vikram Rathore", "email": "vikram.r@campus.edu", "department": "Artificial Intelligence", "roll_no": "AI22B026", "avatar": "vikram"},
    {"student_id": "STU-2024-020", "full_name": "Hannah Schmidt", "email": "hannah.s@campus.edu", "department": "Computer Science & Eng.", "roll_no": "CS21B060", "avatar": "hannah"}
]

SAMPLE_SESSIONS = [
    {
        "session_code": "CS301-SEC-A-01",
        "course_name": "Operating Systems & Concurrency",
        "course_code": "CS301",
        "instructor_name": "Dr. Elena Vance",
        "room": "Turing Hall 402",
        "session_date": (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d"),
        "start_time": "09:00",
        "end_time": "10:30",
        "status": "completed"
    },
    {
        "session_code": "CS402-SEC-B-01",
        "course_name": "Distributed Systems & Cloud Architecture",
        "course_code": "CS402",
        "instructor_name": "Dr. Elena Vance",
        "room": "Lovelace Lab 108",
        "session_date": (datetime.now() - timedelta(days=4)).strftime("%Y-%m-%d"),
        "start_time": "11:00",
        "end_time": "12:30",
        "status": "completed"
    },
    {
        "session_code": "CS301-SEC-A-02",
        "course_name": "Operating Systems & Concurrency",
        "course_code": "CS301",
        "instructor_name": "Dr. Elena Vance",
        "room": "Turing Hall 402",
        "session_date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
        "start_time": "09:00",
        "end_time": "10:30",
        "status": "completed"
    },
    {
        "session_code": "AI205-SEC-A-01",
        "course_name": "Machine Learning Foundations",
        "course_code": "AI205",
        "instructor_name": "Dr. Elena Vance",
        "room": "Auditorium West",
        "session_date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
        "start_time": "14:00",
        "end_time": "15:30",
        "status": "completed"
    },
    {
        "session_code": "CS301-SEC-A-03",
        "course_name": "Operating Systems & Concurrency",
        "course_code": "CS301",
        "instructor_name": "Dr. Elena Vance",
        "room": "Turing Hall 402",
        "session_date": datetime.now().strftime("%Y-%m-%d"),
        "start_time": "09:00",
        "end_time": "10:30",
        "status": "in_progress" # Live active session!
    }
]

def seed_database():
    """Wipes and populates the database with labeled demo dataset."""
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing
    cursor.execute("DELETE FROM engagement_indicators")
    cursor.execute("DELETE FROM attendance_records")
    cursor.execute("DELETE FROM sessions")
    cursor.execute("DELETE FROM students")

    # Insert students
    student_ids = []
    for s in SAMPLE_STUDENTS:
        cursor.execute("""
            INSERT INTO students (student_id, full_name, email, department, roll_no, enrollment_year, status, avatar_seed)
            VALUES (?, ?, ?, ?, ?, 2024, 'active', ?)
        """, (s["student_id"], s["full_name"], s["email"], s["department"], s["roll_no"], s["avatar"]))
        student_ids.append(cursor.lastrowid)

    # Insert sessions
    session_ids = []
    for sess in SAMPLE_SESSIONS:
        cursor.execute("""
            INSERT INTO sessions (session_code, course_name, course_code, instructor_name, room, session_date, start_time, end_time, status, total_registered)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (sess["session_code"], sess["course_name"], sess["course_code"], sess["instructor_name"], sess["room"],
              sess["session_date"], sess["start_time"], sess["end_time"], sess["status"], len(student_ids)))
        session_ids.append(cursor.lastrowid)

    # Seed attendance for each session
    for s_idx, session_id in enumerate(session_ids):
        present_count = 0
        absent_count = 0
        late_count = 0
        excused_count = 0

        for stud_idx, student_pk in enumerate(student_ids):
            # Realistic pattern
            # Student 7 and 13 tend to have lower attendance; student 1-5 have nearly perfect attendance
            if s_idx == 4: # Live session (partially marked so teacher can mark the rest!)
                if stud_idx < 12:
                    status = "present"
                    present_count += 1
                    remarks = "Checked in via doorway terminal"
                elif stud_idx in [12, 13]:
                    status = "late"
                    late_count += 1
                    remarks = "Arrived 12m late due to transit delay"
                elif stud_idx in [14]:
                    status = "excused"
                    excused_count += 1
                    remarks = "Medical leave approved by Dean"
                else:
                    status = "unmarked"
            else:
                seed_val = (stud_idx * 7 + s_idx * 13) % 20
                if seed_val < 15:
                    status = "present"
                    present_count += 1
                    remarks = "Verified present"
                elif seed_val == 15 or seed_val == 16:
                    status = "late"
                    late_count += 1
                    remarks = "Joined 10 mins late"
                elif seed_val == 17:
                    status = "excused"
                    excused_count += 1
                    remarks = "Approved athletic representation"
                else:
                    status = "absent"
                    absent_count += 1
                    remarks = "Unexcused absence"

            check_in = f"{SAMPLE_SESSIONS[s_idx]['session_date']} 09:04:12" if status in ["present", "late"] else None
            cursor.execute("""
                INSERT INTO attendance_records (session_id, student_id, status, marked_method, check_in_time, remarks)
                VALUES (?, ?, ?, 'manual', ?, ?)
            """, (session_id, student_pk, status, check_in, remarks))

        # Update session summary counts
        cursor.execute("""
            UPDATE sessions
            SET present_count = ?, absent_count = ?, late_count = ?, excused_count = ?
            WHERE id = ?
        """, (present_count, absent_count, late_count, excused_count, session_id))

        # Insert engagement indicators for Task 4
        cursor.execute("""
            INSERT INTO engagement_indicators (
                session_id, sustained_presence_count, head_pose_attention_score,
                movement_activity_level, audio_activity_detected, composite_engagement_score, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            session_id,
            present_count,
            84.5 if s_idx % 2 == 0 else 79.2,
            68.0,
            True if s_idx != 3 else False,
            81.8 if s_idx % 2 == 0 else 76.4,
            "High classroom interaction during OS memory paging lecture"
        ))

    conn.commit()
    conn.close()
    print("Database successfully seeded with realistic demo records!")

if __name__ == "__main__":
    seed_database()
