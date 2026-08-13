from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.schemas.exam import (
    ExamCreate,
    ExamResponse
)
from app.services.exam_service import (
    create_exam,
    get_exams_by_student
)
from app.dependencies.auth_dependency import get_current_user


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post(
    "/exams",
    response_model=ExamResponse
)
def create(
    exam: ExamCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return create_exam(db, exam)


@router.get(
    "/students/{student_id}/exams",
    response_model=list[ExamResponse]
)
def read_student_exams(
    student_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_exams_by_student(db, student_id)