from sqlalchemy import Column, Integer, String

from app.database.base import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    code = Column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    name = Column(
        String(150),
        nullable=False,
        index=True,
    )

    department = Column(
        String(100),
        nullable=False,
        index=True,
    )

    semester = Column(
        Integer,
        nullable=False,
        index=True,
    )

    credits = Column(
        Integer,
        nullable=False,
        default=4,
    )
