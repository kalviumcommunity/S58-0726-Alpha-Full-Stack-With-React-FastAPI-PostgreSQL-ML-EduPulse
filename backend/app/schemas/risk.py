from pydantic import BaseModel


class RiskStudentResponse(BaseModel):
    student_id: int
    student_code: str
    name: str
    attendance_percentage: float
    assignment_completion_rate: float
    average_exam_score: float
    risk_level: str