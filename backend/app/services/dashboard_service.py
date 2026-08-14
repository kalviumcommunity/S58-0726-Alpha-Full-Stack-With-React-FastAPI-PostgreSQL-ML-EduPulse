from sqlalchemy.orm import Session

from app.models.student import Student
from app.services.analytics_service import get_student_analytics


def get_dashboard_analytics(db: Session):
    students = db.query(Student).all()

    total_students = len(students)

    if total_students == 0:
        return {
            "total_students": 0,
            "average_attendance": 0,
            "average_assignment_completion": 0,
            "average_exam_score": 0,
            "high_risk_students": 0,
            "medium_risk_students": 0,
            "low_risk_students": 0
        }

    analytics = [
        get_student_analytics(db, student.id)
        for student in students
    ]

    average_attendance = (
        sum(item["attendance_percentage"] for item in analytics)
        / total_students
    )

    average_assignment_completion = (
        sum(
            item["assignment_completion_rate"]
            for item in analytics
        )
        / total_students
    )

    average_exam_score = (
        sum(item["average_exam_score"] for item in analytics)
        / total_students
    )

    high_risk_students = sum(
        1 for item in analytics
        if item["risk_level"] == "High"
    )

    medium_risk_students = sum(
        1 for item in analytics
        if item["risk_level"] == "Medium"
    )

    low_risk_students = sum(
        1 for item in analytics
        if item["risk_level"] == "Low"
    )

    return {
        "total_students": total_students,
        "average_attendance": round(average_attendance, 2),
        "average_assignment_completion": round(
            average_assignment_completion,
            2
        ),
        "average_exam_score": round(
            average_exam_score,
            2
        ),
        "high_risk_students": high_risk_students,
        "medium_risk_students": medium_risk_students,
        "low_risk_students": low_risk_students
    }