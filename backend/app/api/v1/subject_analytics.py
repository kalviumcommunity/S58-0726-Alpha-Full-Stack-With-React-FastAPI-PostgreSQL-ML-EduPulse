from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.schemas.subject_analytics import SubjectAnalyticsResponse
from app.services.subject_analytics_service import get_subject_analytics
from app.dependencies.auth_dependency import get_current_user


router = APIRouter(
    prefix="/students",
    tags=["Subject Analytics"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/{student_id}/subject-analytics",
    response_model=list[SubjectAnalyticsResponse]
)
def subject_analytics(
    student_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_subject_analytics(db, student_id)
