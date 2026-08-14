from pydantic import BaseModel


class SubjectAnalyticsResponse(BaseModel):
    subject: str
    attendance_percentage: float
    assignment_completion_rate: float
    average_exam_score: float