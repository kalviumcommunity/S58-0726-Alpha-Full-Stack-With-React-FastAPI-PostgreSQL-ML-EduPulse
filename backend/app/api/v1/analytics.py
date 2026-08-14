from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.schemas.analytics import StudentAnalyticsResponse
from app.services.analytics_service import get_student_analytics
from app.dependencies.auth_dependency import get_current_user


router = APIRouter(
    prefix="/students",
    tags=["Analytics"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/{student_id}/analytics",
    response_model=StudentAnalyticsResponse
)
def get_analytics(
    student_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_student_analytics(db, student_id)