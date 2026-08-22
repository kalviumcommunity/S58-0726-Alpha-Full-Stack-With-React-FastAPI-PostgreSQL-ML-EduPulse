from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.dependencies.auth_dependency import get_current_user
from app.schemas.intervention import (
    InterventionCreate,
    InterventionResponse,
    InterventionStatusUpdate,
)
from app.services.intervention_service import (
    create_intervention,
    get_interventions,
    update_intervention_status,
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Interventions"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/interventions",
    response_model=list[InterventionResponse],
)
def list_interventions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_interventions(db)


@router.post(
    "/interventions",
    response_model=InterventionResponse,
)
def add_intervention(
    data: InterventionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    intervention = create_intervention(
        db,
        data.model_dump(),
    )

    if not intervention:
        raise HTTPException(
            status_code=404,
            detail="Student not found",
        )

    return {
        "id": intervention.id,
        "student_id": intervention.student_id,
        "student_code": intervention.student.student_id,
        "student_name": intervention.student.name,
        "factor": intervention.factor,
        "action": intervention.action,
        "priority": intervention.priority,
        "description": intervention.description,
        "status": intervention.status,
    }


@router.patch(
    "/interventions/{intervention_id}/status",
    response_model=InterventionResponse,
)
def change_intervention_status(
    intervention_id: int,
    data: InterventionStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    intervention = update_intervention_status(
        db,
        intervention_id,
        data.status,
    )

    if not intervention:
        raise HTTPException(
            status_code=404,
            detail="Intervention not found or invalid status",
        )

    return {
        "id": intervention.id,
        "student_id": intervention.student_id,
        "student_code": intervention.student.student_id,
        "student_name": intervention.student.name,
        "factor": intervention.factor,
        "action": intervention.action,
        "priority": intervention.priority,
        "description": intervention.description,
        "status": intervention.status,
    }
