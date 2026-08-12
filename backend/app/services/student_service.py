from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.student import Student


# =========================
# CREATE STUDENT
# =========================

def create_student(db: Session, student):
    existing_email = (
        db.query(Student)
        .filter(Student.email == student.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Student with this email already exists"
        )

    existing_student_id = (
        db.query(Student)
        .filter(Student.student_id == student.student_id)
        .first()
    )

    if existing_student_id:
        raise HTTPException(
            status_code=400,
            detail="Student ID already exists"
        )

    new_student = Student(
        student_id=student.student_id,
        name=student.name,
        email=student.email,
        department=student.department,
        year=student.year,
        semester=student.semester
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student


# =========================
# GET ALL STUDENTS
# PAGINATION + SEARCH + SORT
# =========================

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
    allowed_sort_fields = {
        "id": Student.id,
        "student_id": Student.student_id,
        "name": Student.name,
        "email": Student.email,
        "department": Student.department,
        "year": Student.year,
        "semester": Student.semester
    }

    column = allowed_sort_fields.get(sort_by)

    if column:
        if order.lower() == "desc":
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


# =========================
# GET ONE STUDENT
# =========================

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


# =========================
# UPDATE STUDENT
# =========================

def update_student(
    db: Session,
    student_id: int,
    student_data
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

    update_data = student_data.model_dump(
        exclude_unset=True
    )

    # Check duplicate email
    if "email" in update_data:
        existing_email = (
            db.query(Student)
            .filter(
                Student.email == update_data["email"],
                Student.id != student_id
            )
            .first()
        )

        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="Student with this email already exists"
            )

    # Check duplicate student ID
    if "student_id" in update_data:
        existing_student_id = (
            db.query(Student)
            .filter(
                Student.student_id == update_data["student_id"],
                Student.id != student_id
            )
            .first()
        )

        if existing_student_id:
            raise HTTPException(
                status_code=400,
                detail="Student ID already exists"
            )

    # Apply updates
    for field, value in update_data.items():
        setattr(student, field, value)

    db.commit()
    db.refresh(student)

    return student


# =========================
# DELETE STUDENT
# =========================

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