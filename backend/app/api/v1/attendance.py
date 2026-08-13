from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceResponse
)
from app.services.attendance_service import (
    create_attendance,
    get_attendance_by_student
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
    "/attendance",
    response_model=AttendanceResponse
)
def create(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return create_attendance(db, attendance)


@router.get(
    "/students/{student_id}/attendance",
    response_model=list[AttendanceResponse]
)
def read_student_attendance(
    student_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_attendance_by_student(db, student_id)