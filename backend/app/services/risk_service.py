from sqlalchemy.orm import Session

from app.models.student import Student
from app.services.analytics_service import get_student_analytics


def get_risk_students(db: Session):
    students = db.query(Student).all()

    risk_students = []

    for student in students:
        analytics = get_student_analytics(db, student.id)

        if analytics["risk_level"] in ["High", "Medium"]:
            risk_students.append({
                "student_id": student.id,
                "student_code": student.student_id,
                "name": student.name,
                "attendance_percentage": analytics["attendance_percentage"],
                "assignment_completion_rate": analytics[
                    "assignment_completion_rate"
                ],
                "average_exam_score": analytics["average_exam_score"],
                "risk_level": analytics["risk_level"]
            })

    return risk_students