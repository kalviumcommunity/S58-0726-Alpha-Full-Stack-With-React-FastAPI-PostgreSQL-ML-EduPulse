from app.database.base import SessionLocal
from app.services.subject_analytics_service import get_subject_analytics


def test_existing_student_returns_subject_analytics():
    db = SessionLocal()

    try:
        result = get_subject_analytics(db, 1)

        assert len(result) > 0

        for subject in result:
            assert "subject" in subject
            assert "attendance_percentage" in subject
            assert "assignment_completion_rate" in subject
            assert "average_exam_score" in subject

    finally:
        db.close()


def test_student_with_no_academic_data_returns_empty_subject_analytics():
    db = SessionLocal()

    try:
        result = get_subject_analytics(db, 7)

        assert result == []

    finally:
        db.close()