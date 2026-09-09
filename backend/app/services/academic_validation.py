from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.student import Student
from app.models.subject import Subject


def validate_student_exists(db: Session, student_id: int):
    student = (
        db.query(Student)
        .filter(Student.id == student_id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return student

def validate_subject_exists(db: Session, subject_id: int):
    subject = (
        db.query(Subject)
        .filter(Subject.id == subject_id)
        .first()
    )

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    return subject

