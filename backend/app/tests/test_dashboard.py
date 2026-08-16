from app.database.base import SessionLocal
from app.services.dashboard_service import get_dashboard_analytics


def test_dashboard_returns_expected_structure():
    db = SessionLocal()

    try:
        result = get_dashboard_analytics(db)

        assert result["total_students"] >= 0
        assert "average_attendance" in result
        assert "average_assignment_completion" in result
        assert "average_exam_score" in result
        assert "high_risk_students" in result
        assert "medium_risk_students" in result
        assert "low_risk_students" in result
        assert "no_data_students" in result

    finally:
        db.close()


def test_dashboard_risk_counts_match_total_students():
    db = SessionLocal()

    try:
        result = get_dashboard_analytics(db)

        risk_count = (
            result["high_risk_students"]
            + result["medium_risk_students"]
            + result["low_risk_students"]
            + result["no_data_students"]
        )

        assert risk_count == result["total_students"]

    finally:
        db.close()