from sqlalchemy.orm import Session

from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate


def get_subjects(db: Session) -> list[Subject]:
    return db.query(Subject).order_by(Subject.semester, Subject.code).all()


def get_subject(db: Session, subject_id: int) -> Subject | None:
    return db.query(Subject).filter(Subject.id == subject_id).first()

def delete_subject(db: Session, subject_id: int) -> str | None:
    subject = get_subject(db, subject_id)

    if subject is None:
        return None

    from app.models.attendance import Attendance
    from app.models.assignment import Assignment
    from app.models.exam import Exam

    references = [
        db.query(Attendance).filter(Attendance.subject_id == subject_id).first(),
        db.query(Assignment).filter(Assignment.subject_id == subject_id).first(),
        db.query(Exam).filter(Exam.subject_id == subject_id).first(),
    ]

    if any(references):
        raise ValueError(
            "Subject cannot be deleted because academic records reference it"
        )

    db.delete(subject)
    db.commit()

    return "Subject deleted successfully"

def update_subject(
    db: Session,
    subject_id: int,
    subject_data: SubjectUpdate,
) -> Subject | None:
    subject = get_subject(db, subject_id)

    if subject is None:
        return None

    if subject_data.code is not None:
        existing_subject = (
            db.query(Subject)
            .filter(
                Subject.code == subject_data.code,
                Subject.id != subject_id,
            )
            .first()
        )

        if existing_subject:
            raise ValueError("Subject code already exists")

    update_data = subject_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(subject, field, value)

    db.commit()
    db.refresh(subject)

    return subject

def create_subject(db: Session, subject_data: SubjectCreate) -> Subject:
    existing_subject = (
        db.query(Subject)
        .filter(Subject.code == subject_data.code)
        .first()
    )

    if existing_subject:
        raise ValueError("Subject code already exists")

    subject = Subject(
        code=subject_data.code,
        name=subject_data.name,
        department=subject_data.department,
        semester=subject_data.semester,
        credits=subject_data.credits,
    )

    db.add(subject)
    db.commit()
    db.refresh(subject)

    return subject
