from sqlalchemy.orm import Session
from app.services.academic_validation import validate_student_exists, validate_subject_exists
from app.models.assignment import Assignment


def create_assignment(db: Session, assignment):
    validate_student_exists(db, assignment.student_id)
    subject = validate_subject_exists(db, assignment.subject_id)

    new_assignment = Assignment(
        student_id=assignment.student_id,
        subject_id=assignment.subject_id,
        title=assignment.title,
        subject=subject.name,
        due_date=assignment.due_date,
        submitted=assignment.submitted,
        score=assignment.score,
    )

    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    return new_assignment


def get_assignments_by_student(db: Session, student_id: int):
    return (
        db.query(Assignment)
        .filter(Assignment.student_id == student_id)
        .order_by(Assignment.due_date.desc())
        .all()
    )