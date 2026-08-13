from sqlalchemy import Column, Integer, String, Date, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class Assignment(Base):
    __tablename__ = "assignments"

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

    title = Column(
        String,
        nullable=False
    )

    subject = Column(
        String,
        nullable=False,
        index=True
    )

    due_date = Column(
        Date,
        nullable=False
    )

    submitted = Column(
        Boolean,
        default=False,
        nullable=False
    )

    score = Column(
        Float,
        nullable=True
    )

    student = relationship(
        "Student",
        back_populates="assignments"
    )