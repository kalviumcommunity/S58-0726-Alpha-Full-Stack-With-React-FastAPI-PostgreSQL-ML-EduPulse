from pydantic import BaseModel


class StudentAnalyticsResponse(BaseModel):
    student_id: int
    attendance_percentage: float
    assignment_completion_rate: float
    average_exam_score: float
    risk_level: str