"""Application configuration settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "EduPulse API"
    app_version: str = "0.1.0"
    debug: bool = False

    database_url: str = "sqlite:///./test.db"

    jwt_secret_key: str = "edupulse-development-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
