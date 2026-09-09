from pydantic import BaseModel, Field


class SubjectCreate(BaseModel):
    code: str = Field(min_length=2, max_length=30)
    name: str = Field(min_length=2, max_length=150)
    department: str = Field(min_length=2, max_length=100)
    semester: int = Field(ge=1, le=12)
    credits: int = Field(ge=1, le=10)


class SubjectUpdate(BaseModel):
    code: str | None = Field(default=None, min_length=2, max_length=30)
    name: str | None = Field(default=None, min_length=2, max_length=150)
    department: str | None = Field(default=None, min_length=2, max_length=100)
    semester: int | None = Field(default=None, ge=1, le=12)
    credits: int | None = Field(default=None, ge=1, le=10)


class SubjectResponse(BaseModel):
    id: int
    code: str
    name: str
    department: str
    semester: int
    credits: int

    model_config = {"from_attributes": True}
