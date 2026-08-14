from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.schemas.performance_trend import PerformanceTrendResponse
from app.services.performance_trend_service import get_performance_trends
from app.dependencies.auth_dependency import get_current_user


router = APIRouter(
    prefix="/students",
    tags=["Performance Trends"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/{student_id}/performance-trends",
    response_model=list[PerformanceTrendResponse]
)
def performance_trends(
    student_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_performance_trends(db, student_id)