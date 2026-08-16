import pytest
from fastapi import HTTPException

from app.database.base import SessionLocal
from app.services.analytics_service import get_student_analytics
from app.services.academic_validation import validate_student_exists


def test_validate_nonexistent_student():
    db = SessionLocal()

    try:
        with pytest.raises(HTTPException) as exc_info:
            validate_student_exists(db, 99999)

        assert exc_info.value.status_code == 404
        assert exc_info.value.detail == "Student not found"

    finally:
        db.close()


def test_analytics_for_nonexistent_student():
    db = SessionLocal()

    try:
        with pytest.raises(HTTPException) as exc_info:
            get_student_analytics(db, 99999)

        assert exc_info.value.status_code == 404
        assert exc_info.value.detail == "Student not found"

    finally:
        db.close()