from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "GeoHeat AI Green Designer API"
    api_v1_prefix: str = "/api/v1"
    cors_origins: list[str] = ["http://localhost:3000"]

    supabase_url: str = ""
    supabase_service_role_key: str = ""

    # "mock" (default, no GPU/API keys needed) or "real" once the
    # YOLO/SAM/FLUX services from the AI Workflow doc are wired in.
    ai_provider: str = "mock"


@lru_cache
def get_settings() -> Settings:
    return Settings()
