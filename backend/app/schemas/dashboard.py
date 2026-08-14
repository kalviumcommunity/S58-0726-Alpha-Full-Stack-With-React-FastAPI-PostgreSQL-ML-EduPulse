from pydantic import BaseModel


class DashboardAnalyticsResponse(BaseModel):
    total_students: int
    average_attendance: float
    average_assignment_completion: float
    average_exam_score: float
    high_risk_students: int
    medium_risk_students: int
    low_risk_students: int