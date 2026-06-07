from fastapi import FastAPI, Request, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import engine, Base
from app.routers import auth, designs, projects, payments, account, rooms
from app.middleware.security import setup_middleware
import os

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    # Disable redoc and swagger UI in production
    redoc_url=None if settings.ENVIRONMENT == "production" else "/redoc",
    docs_url=None if settings.ENVIRONMENT == "production" else "/docs",
)

# Setup all middleware (security, rate limiting, logging)
setup_middleware(app)

# CORS - configured after security middleware
from fastapi.middleware.cors import CORSMiddleware
allowed_origins = ["http://localhost:3000"]
if settings.FRONTEND_URL and settings.FRONTEND_URL not in allowed_origins:
    allowed_origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files statically
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(account.router, prefix=f"{settings.API_V1_STR}/account", tags=["account"])
app.include_router(designs.router, prefix=f"{settings.API_V1_STR}/designs", tags=["designs"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["projects"])
app.include_router(payments.router, prefix=f"{settings.API_V1_STR}/payments", tags=["payments"])
app.include_router(rooms.router, prefix=f"{settings.API_V1_STR}/rooms", tags=["rooms"])

@app.get("/")
def root():
    return {"message": "Welcome to RoomsGPT API — GPT-5.2 Renovation Engine"}

@app.get("/health")
def health():
    return {"status": "ok", "engine": "gpt52-renovation"}

@app.get(f"{settings.API_V1_STR}/ai-status")
async def ai_status_endpoint():
    """Report AI engine status: GPT-5.2 renovation with gpt-image-2 editing."""
    from app.services.ai_service import ai_status
    return await ai_status()


@app.get(f"{settings.API_V1_STR}/styles")
async def get_styles():
    """Return available design style presets."""
    from app.services.ai_service import STYLE_PRESETS
    return {
        "styles": STYLE_PRESETS,
        "count": len(STYLE_PRESETS),
    }


@app.get(f"{settings.API_V1_STR}/styles/{{style_name}}/suggestions")
async def get_style_suggestions(style_name: str, room_type: str = "Living Room"):
    """Get AI-powered design suggestions for a specific style and room type."""
    from app.services.ai_service import get_style_suggestions
    return await get_style_suggestions(room_type=room_type, current_style=style_name)
