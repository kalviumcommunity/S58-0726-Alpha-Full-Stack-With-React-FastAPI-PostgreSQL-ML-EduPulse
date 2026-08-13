from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.student import Student


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