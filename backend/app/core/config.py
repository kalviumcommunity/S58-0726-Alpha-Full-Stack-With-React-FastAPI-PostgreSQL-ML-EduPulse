"""Application configuration settings."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "EduPulse API"
    app_version: str = "0.1.0"
    debug: bool = False
    database_url: str = "postgresql://postgres:postgres@localhost:5432/edupulse"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
