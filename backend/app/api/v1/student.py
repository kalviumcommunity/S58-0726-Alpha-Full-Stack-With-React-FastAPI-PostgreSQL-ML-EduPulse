from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.schemas.student import StudentCreate, StudentUpdate

from app.dependencies.role import require_role
from app.dependencies.auth_dependency import get_current_user

from app.services.student_service import (
    create_student,
    get_students,
    get_student_by_id,
    update_student,
    delete_student
)


router = APIRouter()


# ==============================
# DB DEPENDENCY
# ==============================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ==============================
# CREATE STUDENT
# Logged-in users only
# ==============================

@router.post("/students")
def create(
    student: StudentCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return create_student(db, student)


# ==============================
# GET ALL STUDENTS
# ADMIN ONLY
# Pagination + Search + Sort
# ==============================

@router.get("/students")
def read_all(
    page: int = 1,
    limit: int = 5,
    search: str = None,
    sort_by: str = "id",
    order: str = "asc",
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    return get_students(
        db,
        page,
        limit,
        search,
        sort_by,
        order
    )


# ==============================
# GET ONE STUDENT
# Logged-in users only
# ==============================

@router.get("/students/{student_id}")
def read_one(
    student_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_student_by_id(db, student_id)


# ==============================
# UPDATE STUDENT
# ADMIN ONLY
# ==============================

@router.put("/students/{student_id}")
def update(
    student_id: int,
    student: StudentUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    return update_student(
        db,
        student_id,
        student
    )


# ==============================
# DELETE STUDENT
# ADMIN ONLY
# ==============================

@router.delete("/students/{student_id}")
def delete(
    student_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    return delete_student(
        db,
        student_id
    )