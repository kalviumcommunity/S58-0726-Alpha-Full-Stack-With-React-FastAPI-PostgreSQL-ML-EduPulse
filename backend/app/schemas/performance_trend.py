from datetime import date

from pydantic import BaseModel


class PerformanceTrendResponse(BaseModel):
    date: date
    subject: str
    score: float