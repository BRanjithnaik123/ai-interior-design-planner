from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.pool import QueuePool
from app.config import settings

# Configure engine based on database type
if settings.DATABASE_URL.startswith("sqlite"):
    # SQLite for local development
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=settings.ENVIRONMENT == "development",  # Log SQL in dev
    )
else:
    # PostgreSQL for production with connection pooling
    engine = create_engine(
        settings.DATABASE_URL,
        poolclass=QueuePool,
        pool_size=20,
        max_overflow=30,
        pool_pre_ping=True,  # Verify connections before using
        pool_recycle=3600,   # Recycle connections after 1 hour
        echo=settings.ENVIRONMENT == "development",
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Session:
    """Dependency to get DB session with proper cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
