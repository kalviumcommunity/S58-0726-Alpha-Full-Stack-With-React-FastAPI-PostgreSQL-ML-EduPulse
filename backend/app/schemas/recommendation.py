from pydantic import BaseModel


class RecommendationResponse(BaseModel):
    factor: str
    severity: str
    value: float
    action: str
    priority: str
    description: str
