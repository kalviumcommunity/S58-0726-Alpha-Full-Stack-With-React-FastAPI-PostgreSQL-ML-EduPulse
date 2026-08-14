from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.schemas.dashboard import DashboardAnalyticsResponse
from app.services.dashboard_service import get_dashboard_analytics
from app.dependencies.auth_dependency import get_current_user


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/analytics",
    response_model=DashboardAnalyticsResponse
)
def dashboard_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_dashboard_analytics(db)