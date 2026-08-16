from datetime import date

import pytest
from pydantic import ValidationError

from app.schemas.attendance import AttendanceCreate
from app.schemas.assignment import AssignmentCreate
from app.schemas.exam import ExamCreate


def test_invalid_attendance_student_id():
    with pytest.raises(ValidationError):
        AttendanceCreate(
            student_id="invalid",
            subject="Mathematics",
            date=date(2026, 8, 16),
            status="Present"
        )


def test_invalid_assignment_score():
    with pytest.raises(ValidationError):
        AssignmentCreate(
            student_id=1,
            title="Test Assignment",
            subject="Mathematics",
            due_date=date(2026, 8, 16),
            submitted=True,
            score=150
        )


def test_invalid_exam_score():
    with pytest.raises(ValidationError):
        ExamCreate(
            student_id=1,
            subject="Mathematics",
            exam_type="Midterm",
            exam_date=date(2026, 8, 16),
            score=150
        )