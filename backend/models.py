"""
Data models and dictionary conversion utilities for Multimodal Attendance & Engagement Agent.
"""

from dataclasses import dataclass, asdict
from typing import Optional, List, Dict, Any
from datetime import datetime

@dataclass
class StudentModel:
    id: Optional[int]
    student_id: str
    full_name: str
    email: str
    department: str
    roll_no: str
    enrollment_year: int = 2024
    status: str = "active"
    avatar_seed: Optional[str] = None
    created_at: Optional[str] = None

    @classmethod
    def from_row(cls, row) -> "StudentModel":
        return cls(
            id=row["id"],
            student_id=row["student_id"],
            full_name=row["full_name"],
            email=row["email"],
            department=row["department"],
            roll_no=row["roll_no"],
            enrollment_year=row["enrollment_year"],
            status=row["status"],
            avatar_seed=row["avatar_seed"],
            created_at=row["created_at"] if "created_at" in row.keys() else None,
        )

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

@dataclass
class SessionModel:
    id: Optional[int]
    session_code: str
    course_name: str
    course_code: str
    instructor_name: str
    room: str
    session_date: str
    start_time: str
    end_time: str
    status: str = "scheduled" # scheduled, in_progress, completed
    total_registered: int = 0
    present_count: int = 0
    absent_count: int = 0
    late_count: int = 0
    excused_count: int = 0
    created_at: Optional[str] = None

    @classmethod
    def from_row(cls, row) -> "SessionModel":
        return cls(
            id=row["id"],
            session_code=row["session_code"],
            course_name=row["course_name"],
            course_code=row["course_code"],
            instructor_name=row["instructor_name"],
            room=row["room"],
            session_date=row["session_date"],
            start_time=row["start_time"],
            end_time=row["end_time"],
            status=row["status"],
            total_registered=row["total_registered"],
            present_count=row["present_count"],
            absent_count=row["absent_count"],
            late_count=row["late_count"],
            excused_count=row["excused_count"],
            created_at=row["created_at"] if "created_at" in row.keys() else None,
        )

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

@dataclass
class AttendanceRecordModel:
    id: Optional[int]
    session_id: int
    student_id: int
    status: str # present, absent, late, excused, unmarked
    marked_method: str = "manual"
    confidence_score: float = 1.0
    check_in_time: Optional[str] = None
    remarks: Optional[str] = None
    last_corrected_by: Optional[str] = None
    last_corrected_at: Optional[str] = None
    created_at: Optional[str] = None

    @classmethod
    def from_row(cls, row) -> "AttendanceRecordModel":
        return cls(
            id=row["id"],
            session_id=row["session_id"],
            student_id=row["student_id"],
            status=row["status"],
            marked_method=row["marked_method"],
            confidence_score=row["confidence_score"],
            check_in_time=row["check_in_time"],
            remarks=row["remarks"],
            last_corrected_by=row["last_corrected_by"],
            last_corrected_at=row["last_corrected_at"],
            created_at=row["created_at"] if "created_at" in row.keys() else None,
        )

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
