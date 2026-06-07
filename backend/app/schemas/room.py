"""
Room API Schemas

Request/Response models for the room analysis and design saving endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class RoomAnalysisRequest(BaseModel):
    """Optional hints for room analysis."""
    room_type: Optional[str] = Field(default=None, description="User-selected room type hint")


class RoomAnalysisResponse(BaseModel):
    """Response from the room analysis endpoint."""
    room_id: str
    original_image_url: str
    room_type: str
    room_type_confidence: float
    metadata: dict = Field(description="Full RoomMetadata as dict")
    analysis_warnings: list[str] = Field(default_factory=list)


class MaterialConfig(BaseModel):
    """Material configuration for a surface."""
    type: str = Field(description="Material type: paint, hardwood, marble, tile, etc.")
    color: Optional[str] = Field(default=None, description="Hex color string")
    texture: Optional[str] = Field(default=None, description="Texture key from library")
    finish: Optional[str] = Field(default=None, description="Surface finish: matte, eggshell, satin, gloss")


class LightConfig(BaseModel):
    """A point light configuration."""
    position: list[float] = Field(description="[x, y, z] position")
    intensity: float = 0.6
    color: str = "#FFF5E0"


class LightingConfig(BaseModel):
    """Complete lighting configuration."""
    preset: str = Field(default="warm_ambient")
    ambient_intensity: Optional[float] = None
    directional_intensity: Optional[float] = None
    point_lights: list[LightConfig] = Field(default_factory=list)


class FurnitureItem(BaseModel):
    """A furniture item placed in the scene."""
    type: str
    model: str = Field(description="Model key: modern_sofa, round_table, etc.")
    position: list[float] = Field(description="[x, y, z]")
    rotation: list[float] = Field(default=[0, 0, 0])
    scale: list[float] = Field(default=[1, 1, 1])
    color: Optional[str] = None


class DecorationItem(BaseModel):
    """A decoration item."""
    type: str
    model: str
    position: list[float]
    size: Optional[list[float]] = None
    color: Optional[str] = None


class SaveDesignRequest(BaseModel):
    """Request to save a renovation design."""
    name: str = Field(description="Design name")
    style: str = Field(description="Style name: Modern, Luxury, etc.")
    wall_materials: dict[str, MaterialConfig] = Field(default_factory=dict)
    floor_material: Optional[MaterialConfig] = None
    ceiling_material: Optional[MaterialConfig] = None
    lighting: Optional[LightingConfig] = None
    furniture: list[FurnitureItem] = Field(default_factory=list)
    decorations: list[DecorationItem] = Field(default_factory=list)
    screenshot_base64: Optional[str] = Field(default=None, description="Three.js canvas screenshot")


class SaveDesignResponse(BaseModel):
    """Response after saving a design."""
    design_id: int
    room_id: str
    name: str
    thumbnail_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
