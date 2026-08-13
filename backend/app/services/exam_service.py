from sqlalchemy.orm import Session
from app.services.academic_validation import validate_student_exists
from app.models.exam import Exam


def create_exam(db: Session, exam):
    validate_student_exists(db, exam.student_id)
    new_exam = Exam(
        student_id=exam.student_id,
        subject=exam.subject,
        exam_type=exam.exam_type,
        exam_date=exam.exam_date,
        score=exam.score
    )

    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)

    return new_exam


def get_exams_by_student(db: Session, student_id: int):
    return (
        db.query(Exam)
        .filter(Exam.student_id == student_id)
        .order_by(Exam.exam_date.desc())
        .all()
    )