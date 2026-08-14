from sqlalchemy.orm import Session

from app.models.exam import Exam
from app.services.academic_validation import validate_student_exists


def get_performance_trends(db: Session, student_id: int):
    # Make sure the student exists
    validate_student_exists(db, student_id)

    exams = (
        db.query(Exam)
        .filter(Exam.student_id == student_id)
        .order_by(Exam.exam_date.asc())
        .all()
    )

    performance_trends = [
        {
            "date": exam.exam_date,
            "subject": exam.subject,
            "score": exam.score
        }
        for exam in exams
    ]

    return performance_trends