from datetime import date

from pydantic import BaseModel, Field


class InterventionCreate(BaseModel):
    student_id: int
    factor: str = Field(min_length=1, max_length=100)
    action: str = Field(min_length=1, max_length=150)
    priority: str = Field(min_length=1, max_length=20)
    description: str = Field(min_length=1)
    due_date: date | None = None


class InterventionStatusUpdate(BaseModel):
    status: str = Field(min_length=1, max_length=30)


class InterventionOutcomeUpdate(BaseModel):
    outcome: str = Field(min_length=1, max_length=30)
    outcome_notes: str | None = None
    outcome_date: date | None = None


class InterventionResponse(BaseModel):
    id: int
    student_id: int
    student_code: str
    student_name: str
    factor: str
    action: str
    priority: str
    description: str
    status: str
    due_date: date | None = None
    outcome: str | None = None
    outcome_notes: str | None = None
    outcome_date: date | None = None
