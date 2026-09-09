from sqlalchemy.orm import Session

from app.models.intervention import Intervention
from app.models.student import Student


ALLOWED_STATUSES = {
    "Pending",
    "In Progress",
    "Completed",
}

ALLOWED_OUTCOMES = {
    "Improved",
    "No Improvement",
    "Needs Follow-up",
}


def create_intervention(
    db: Session,
    data: dict,
):
    student = (
        db.query(Student)
        .filter(Student.id == data["student_id"])
        .first()
    )

    if not student:
        return None

    intervention = Intervention(
        student_id=data["student_id"],
        factor=data["factor"],
        action=data["action"],
        priority=data["priority"],
        description=data["description"],
        status="Pending",
        due_date=data.get("due_date"),
    )

    db.add(intervention)
    db.commit()
    db.refresh(intervention)

    return intervention


def get_interventions(db: Session):
    rows = (
        db.query(Intervention, Student)
        .join(
            Student,
            Intervention.student_id == Student.id,
        )
        .order_by(Intervention.id.desc())
        .all()
    )

    return [
        {
            "id": intervention.id,
            "student_id": student.id,
            "student_code": student.student_id,
            "student_name": student.name,
            "factor": intervention.factor,
            "action": intervention.action,
            "priority": intervention.priority,
            "description": intervention.description,
            "status": intervention.status,
            "due_date": intervention.due_date,
            "outcome": intervention.outcome,
            "outcome_notes": intervention.outcome_notes,
            "outcome_date": intervention.outcome_date,
        }
        for intervention, student in rows
    ]


def update_intervention_status(
    db: Session,
    intervention_id: int,
    status: str,
):
    if status not in ALLOWED_STATUSES:
        return None

    intervention = (
        db.query(Intervention)
        .filter(Intervention.id == intervention_id)
        .first()
    )

    if not intervention:
        return None

    intervention.status = status

    db.commit()
    db.refresh(intervention)

    return intervention


def update_intervention_outcome(
    db: Session,
    intervention_id: int,
    outcome: str,
    outcome_notes: str | None,
    outcome_date,
):
    if outcome not in ALLOWED_OUTCOMES:
        return None

    intervention = (
        db.query(Intervention)
        .filter(Intervention.id == intervention_id)
        .first()
    )

    if not intervention:
        return None

    intervention.outcome = outcome
    intervention.outcome_notes = outcome_notes
    intervention.outcome_date = outcome_date

    db.commit()
    db.refresh(intervention)

    return intervention
