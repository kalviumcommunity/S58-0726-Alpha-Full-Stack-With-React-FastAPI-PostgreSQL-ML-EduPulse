from pydantic import BaseModel


class RiskFactorResponse(BaseModel):
    factor: str
    severity: str
    value: float
    message: str


class RiskStudentResponse(BaseModel):
    student_id: int
    student_code: str
    name: str
    attendance_percentage: float
    assignment_completion_rate: float
    average_exam_score: float
    risk_level: str
    ml_risk_level: str
    ml_risk_probabilities: dict[str, float]
    risk_factors: list[RiskFactorResponse]
