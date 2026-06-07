from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "DesignAI API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./designai.db")

    # OpenAI Image API (gpt-image-2)
    _raw_image_key: str = os.getenv("OPENAI_IMAGE_API_KEY", "")
    OPENAI_IMAGE_BASE_URL: str = os.getenv("OPENAI_IMAGE_BASE_URL", "https://api.openai.com/v1")
    OPENAI_IMAGE_MODEL: str = os.getenv("OPENAI_IMAGE_MODEL", "gpt-image-2")
    OPENAI_IMAGE_SIZE: str = os.getenv("OPENAI_IMAGE_SIZE", "1536x1024")

    # Safe fallback computation
    @property
    def OPENAI_IMAGE_API_KEY(self) -> str:
        if self._raw_image_key:
            return self._raw_image_key
        # Check if they share the same provider endpoint
        chat_url = os.getenv("OPENAI_BASE_URL", "")
        if self.OPENAI_IMAGE_BASE_URL.rstrip("/") == chat_url.rstrip("/"):
            return os.getenv("OPENAI_API_KEY", "")
        return ""

    # OpenAI-Compatible Provider (room classification & suggestions)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-5.2")

    # Stripe
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    STRIPE_PRICE_STARTER: str = os.getenv("STRIPE_PRICE_STARTER", "")
    STRIPE_PRICE_PROFESSIONAL: str = os.getenv("STRIPE_PRICE_PROFESSIONAL", "")
    STRIPE_PRICE_BUSINESS: str = os.getenv("STRIPE_PRICE_BUSINESS", "")

    # Frontend URL for callbacks
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

settings = Settings()
