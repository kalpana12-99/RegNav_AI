from typing import ClassVar
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    PORT: int = 5000
    OPENAI_API_KEY: SecretStr = SecretStr("")
    QDRANT_DB_URL: str = ""
    LLM_MODEL: str = "gpt-4o-mini"
    EMBEDDINGS_MODEL: str = "text-embedding-3-small"
    COLLECTION_NAME: str = "regnav-documents"
    UPLOAD_DIR: str = "public/tmp"

    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

config = Config()
