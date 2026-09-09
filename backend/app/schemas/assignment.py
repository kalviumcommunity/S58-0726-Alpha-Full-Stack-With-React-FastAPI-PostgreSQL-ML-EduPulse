from datetime import date

from pydantic import BaseModel, Field


class AssignmentCreate(BaseModel):
    student_id: int
    subject_id: int
    title: str = Field(min_length=2, max_length=200)
    subject: str | None = Field(default=None, min_length=2, max_length=100)
    due_date: date
    submitted: bool = False
    score: float | None = Field(default=None, ge=0, le=100)


class AssignmentResponse(BaseModel):
    id: int
    student_id: int
    subject_id: int | None
    title: str
    subject: str
    due_date: date
    submitted: bool
    score: float | None

    class Config:
        from_attributes = True