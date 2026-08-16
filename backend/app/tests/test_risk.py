from app.database.base import SessionLocal
from app.services.risk_service import get_risk_students


def test_no_data_students_are_not_in_risk_list():
    db = SessionLocal()

    try:
        result = get_risk_students(db)

        for student in result:
            assert student["risk_level"] in ["High", "Medium"]

    finally:
        db.close()