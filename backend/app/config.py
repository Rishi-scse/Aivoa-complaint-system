import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./complaints.db")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemma2-9b-it") # gemma2-9b-it or llama-3.3-70b-versatile

settings = Settings()
