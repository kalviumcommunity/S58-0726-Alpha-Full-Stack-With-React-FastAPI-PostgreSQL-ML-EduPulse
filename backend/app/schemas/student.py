from pydantic import BaseModel, EmailStr
from typing import Optional


class StudentCreate(BaseModel):
    student_id: str
    name: str
    email: EmailStr
    department: str
    year: int
    semester: int


class StudentUpdate(BaseModel):
    student_id: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    year: Optional[int] = None
    semester: Optional[int] = None


class StudentResponse(BaseModel):
    id: int
    student_id: str
    name: str
    email: EmailStr
    department: str
    year: int
    semester: int

    class Config:
        from_attributes = True