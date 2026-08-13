from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.schemas.assignment import (
    AssignmentCreate,
    AssignmentResponse
)
from app.services.assignment_service import (
    create_assignment,
    get_assignments_by_student
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
    "/assignments",
    response_model=AssignmentResponse
)
def create(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return create_assignment(db, assignment)


@router.get(
    "/students/{student_id}/assignments",
    response_model=list[AssignmentResponse]
)
def read_student_assignments(
    student_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_assignments_by_student(db, student_id)