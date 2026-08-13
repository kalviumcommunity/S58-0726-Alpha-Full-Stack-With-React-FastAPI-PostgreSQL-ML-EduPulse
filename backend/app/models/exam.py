from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class Exam(Base):
    __tablename__ = "exams"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False,
        index=True
    )

    subject = Column(
        String,
        nullable=False,
        index=True
    )

    exam_type = Column(
        String,
        nullable=False
    )

    exam_date = Column(
        Date,
        nullable=False
    )

    score = Column(
        Float,
        nullable=False
    )

    student = relationship(
        "Student",
        back_populates="exams"
    )