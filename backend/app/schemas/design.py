from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DesignBase(BaseModel):
    project_id: int
    style: str
    room_type: Optional[str] = ""
    mode: Optional[str] = "Renovate"
    prompt: Optional[str] = None

class DesignCreate(DesignBase):
    original_image_url: str

class DesignResponse(DesignBase):
    id: int
    original_image_url: str
    generated_image_url: Optional[str] = None
    status: str
    detected_room_type: Optional[str] = None
    is_favorite: bool = False
    is_public: bool = False
    share_token: Optional[str] = None
    download_count: int = 0
    generation_time_ms: Optional[int] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    validation_score: Optional[float] = None
    validation_feedback: Optional[str] = None
    
    class Config:
        from_attributes = True

class DesignUpdateRequest(BaseModel):
    is_favorite: Optional[bool] = None
    is_public: Optional[bool] = None

class DesignPublicResponse(BaseModel):
    """Public view of a shared design — no auth required."""
    id: int
    original_image_url: str
    generated_image_url: Optional[str] = None
    style: str
    room_type: Optional[str] = ""
    mode: Optional[str] = "Renovate"
    is_favorite: bool = False
    download_count: int = 0
    generation_time_ms: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class RoomAnalysisResponse(BaseModel):
    detected_room_type: str
    confidence: float
    detected_elements: list[str]
    lighting_conditions: str
    suggested_styles: list[str]

class GalleryDesignResponse(BaseModel):
    """Compact response for gallery listings."""
    id: int
    original_image_url: str
    generated_image_url: Optional[str] = None
    style: str
    room_type: Optional[str] = ""
    mode: Optional[str] = "Renovate"
    is_favorite: bool = False
    generation_time_ms: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
