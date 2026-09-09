from sqlalchemy.orm import Session
from app.services.academic_validation import validate_student_exists, validate_subject_exists
from app.models.attendance import Attendance


def create_attendance(db: Session, attendance):
    validate_student_exists(db, attendance.student_id)
    subject = validate_subject_exists(db, attendance.subject_id)

    new_attendance = Attendance(
        student_id=attendance.student_id,
        subject_id=attendance.subject_id,
        subject=subject.name,
        date=attendance.date,
        status=attendance.status,
    )

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return new_attendance


def get_attendance_by_student(db: Session, student_id: int):
    return (
        db.query(Attendance)
        .filter(Attendance.student_id == student_id)
        .order_by(Attendance.date.desc())
        .all()
    )