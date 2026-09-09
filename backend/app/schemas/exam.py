from datetime import date

from pydantic import BaseModel, Field


class ExamCreate(BaseModel):
    student_id: int
    subject_id: int
    subject: str | None = Field(default=None, min_length=2, max_length=100)
    exam_type: str = Field(min_length=2, max_length=50)
    exam_date: date
    score: float = Field(ge=0, le=100)


class ExamResponse(BaseModel):
    id: int
    student_id: int
    subject_id: int | None
    subject: str
    exam_type: str
    exam_date: date
    score: float

    class Config:
        from_attributes = True