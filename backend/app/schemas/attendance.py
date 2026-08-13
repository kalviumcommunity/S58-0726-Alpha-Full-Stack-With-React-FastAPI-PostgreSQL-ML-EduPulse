from datetime import date

from pydantic import BaseModel, Field


class AttendanceCreate(BaseModel):
    student_id: int
    subject: str = Field(min_length=2, max_length=100)
    date: date
    status: str


class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    subject: str
    date: date
    status: str

    class Config:
        from_attributes = True