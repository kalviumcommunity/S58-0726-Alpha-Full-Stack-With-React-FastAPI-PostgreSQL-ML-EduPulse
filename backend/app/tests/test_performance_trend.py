from app.database.base import SessionLocal
from app.services.performance_trend_service import get_performance_trends


def test_existing_student_returns_performance_trends():
    db = SessionLocal()

    try:
        result = get_performance_trends(db, 1)

        assert len(result) > 0

        for trend in result:
            assert "date" in trend
            assert "subject" in trend
            assert "score" in trend

    finally:
        db.close()


def test_student_with_no_exams_returns_empty_trends():
    db = SessionLocal()

    try:
        result = get_performance_trends(db, 7)

        assert result == []

    finally:
        db.close()