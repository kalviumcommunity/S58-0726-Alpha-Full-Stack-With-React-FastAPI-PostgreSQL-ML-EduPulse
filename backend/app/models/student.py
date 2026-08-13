from sqlalchemy import Column, Integer, String
from app.database.base import Base
from sqlalchemy.orm import relationship


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    name = Column(
        String,
        index=True,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    department = Column(
        String,
        index=True,
        nullable=False
    )

    year = Column(
        Integer,
        nullable=False
    )

    semester = Column(
        Integer,
        nullable=False
    )

    attendance_records = relationship(
        "Attendance",
        back_populates="student",
        cascade="all, delete-orphan"
    )

    assignments = relationship(
        "Assignment",
        back_populates="student",
        cascade="all, delete-orphan"
    )

    exams = relationship(
        "Exam",
        back_populates="student",
        cascade="all, delete-orphan"
    )