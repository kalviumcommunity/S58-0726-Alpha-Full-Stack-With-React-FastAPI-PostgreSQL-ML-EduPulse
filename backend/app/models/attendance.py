from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False,
        index=True
    )

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id"),
        nullable=True,
        index=True
    )

    subject = Column(
        String,
        nullable=False,
        index=True
    )

    date = Column(
        Date,
        nullable=False
    )

    status = Column(
        String,
        nullable=False
    )

    student = relationship(
        "Student",
        back_populates="attendance_records"
    )

    subject_entity = relationship("Subject")