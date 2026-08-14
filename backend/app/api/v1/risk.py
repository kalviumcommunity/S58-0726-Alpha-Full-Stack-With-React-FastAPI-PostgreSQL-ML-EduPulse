from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.schemas.risk import RiskStudentResponse
from app.services.risk_service import get_risk_students
from app.dependencies.auth_dependency import get_current_user


router = APIRouter(
    prefix="/dashboard",
    tags=["Risk Monitoring"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/risk-students",
    response_model=list[RiskStudentResponse]
)
def risk_students(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_risk_students(db)