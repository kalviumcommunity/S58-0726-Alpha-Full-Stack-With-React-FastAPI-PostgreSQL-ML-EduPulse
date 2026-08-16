from app.database.base import SessionLocal
from app.services.analytics_service import get_student_analytics


def test_existing_student_returns_analytics():
    db = SessionLocal()

    try:
        result = get_student_analytics(db, 1)

        assert result["student_id"] == 1
        assert "attendance_percentage" in result
        assert "assignment_completion_rate" in result
        assert "average_exam_score" in result
        assert "risk_level" in result

    finally:
        db.close()


def test_student_with_no_academic_data_returns_no_data():
    db = SessionLocal()

    try:
        result = get_student_analytics(db, 7)

        assert result["student_id"] == 7
        assert result["attendance_percentage"] == 0
        assert result["assignment_completion_rate"] == 0
        assert result["average_exam_score"] == 0
        assert result["risk_level"] == "No Data"

    finally:
        db.close()