from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date
from sqlalchemy.orm import relationship

from app.database.base import Base


class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False,
        index=True,
    )

    factor = Column(
        String(100),
        nullable=False,
    )

    action = Column(
        String(150),
        nullable=False,
    )

    priority = Column(
        String(20),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    status = Column(
        String(30),
        nullable=False,
        default="Pending",
    )

    due_date = Column(
        Date,
        nullable=True,
    )

    outcome = Column(
        String(30),
        nullable=True,
    )

    outcome_notes = Column(
        Text,
        nullable=True,
    )

    outcome_date = Column(
        Date,
        nullable=True,
    )

    student = relationship(
        "Student",
        back_populates="interventions",
    )
