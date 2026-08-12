from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.student import Student


# ==============================
# CREATE STUDENT
# ==============================

def create_student(db: Session, student):
    new_student = Student(
        name=student.name,
        email=student.email
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student


# ==============================
# GET ALL STUDENTS
# Pagination + Search + Sort
# ==============================

def get_students(
    db: Session,
    page: int,
    limit: int,
    search: str = None,
    sort_by: str = "id",
    order: str = "asc"
):
    query = db.query(Student)

    # SEARCH
    if search:
        query = query.filter(
            Student.name.ilike(f"%{search}%")
        )

    # SORT
    if hasattr(Student, sort_by):
        column = getattr(Student, sort_by)

        if order == "desc":
            query = query.order_by(column.desc())
        else:
            query = query.order_by(column.asc())

    # TOTAL
    total = query.count()

    # PAGINATION
    data = (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": data
    }


# ==============================
# GET ONE STUDENT
# ==============================

def get_student_by_id(
    db: Session,
    student_id: int
):
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


# ==============================
# UPDATE STUDENT
# Admin only through API dependency
# ==============================

def update_student(
    db: Session,
    student_id: int,
    student
):
    existing_student = (
        db.query(Student)
        .filter(Student.id == student_id)
        .first()
    )

    if not existing_student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    existing_student.name = student.name
    existing_student.email = student.email

    db.commit()
    db.refresh(existing_student)

    return existing_student


# ==============================
# DELETE STUDENT
# ==============================

def delete_student(
    db: Session,
    student_id: int
):
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

    db.delete(student)
    db.commit()

    return {
        "message": "Deleted"
    }