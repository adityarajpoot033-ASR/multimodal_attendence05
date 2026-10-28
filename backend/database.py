"""
Database management and SQLite connection handler for Multimodal Attendance & Engagement Agent.
Skillwallet Foundation Project.
"""

import sqlite3
import os
from typing import Optional

DB_FILE = os.environ.get("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "attendance.db"))

def get_db_connection() -> sqlite3.Connection:
    """Creates a connection to the SQLite database with row factory for dict-like access."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    """Initializes SQLite database schemas for students, sessions, attendance, and engagement logs."""
    os.makedirs(os.path.dirname(os.path.abspath(DB_FILE)), exist_ok=True)
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Students table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            department TEXT NOT NULL,
            roll_no TEXT UNIQUE NOT NULL,
            enrollment_year INTEGER NOT NULL DEFAULT 2024,
            status TEXT NOT NULL DEFAULT 'active',
            avatar_seed TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # 2. Class Sessions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_code TEXT UNIQUE NOT NULL,
            course_name TEXT NOT NULL,
            course_code TEXT NOT NULL,
            instructor_name TEXT NOT NULL DEFAULT 'Dr. Elena Vance',
            room TEXT NOT NULL,
            session_date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            status TEXT NOT NULL DEFAULT 'completed', -- 'scheduled', 'in_progress', 'completed'
            total_registered INTEGER DEFAULT 0,
            present_count INTEGER DEFAULT 0,
            absent_count INTEGER DEFAULT 0,
            late_count INTEGER DEFAULT 0,
            excused_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # 3. Attendance Records table (with manual marking, corrections, and timestamps)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS attendance_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            student_id INTEGER NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'late', 'excused', 'unmarked')),
            marked_method TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'cv_detected', 'hybrid'
            confidence_score REAL DEFAULT 1.0,
            check_in_time TIMESTAMP,
            remarks TEXT,
            last_corrected_by TEXT,
            last_corrected_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE,
            FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
            UNIQUE(session_id, student_id)
        );
    """)

    # 4. Multimodal Engagement Indicators (foundation for Tasks 3 & 4)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS engagement_indicators (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            sustained_presence_count INTEGER DEFAULT 0,
            head_pose_attention_score REAL DEFAULT 0.0, -- 0.0 to 100.0
            movement_activity_level REAL DEFAULT 0.0,
            audio_activity_detected BOOLEAN DEFAULT FALSE,
            composite_engagement_score REAL DEFAULT 0.0,
            notes TEXT,
            FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
        );
    """)

    conn.commit()
    conn.close()
    print(f"Database initialized successfully at: {DB_FILE}")

if __name__ == "__main__":
    init_db()
