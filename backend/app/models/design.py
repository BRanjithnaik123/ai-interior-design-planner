from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Design(Base):
    __tablename__ = "designs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    
    original_image_url = Column(String, nullable=False)
    generated_image_url = Column(String)
    
    style = Column(String, nullable=False)
    room_type = Column(String, default="")
    mode = Column(String, default="Renovate")        # Renovate, Virtual Stage, Wall Paint, etc.
    prompt = Column(String)
    
    # Room analysis metadata (populated automatically after upload)
    detected_room_type = Column(String)
    analysis_confidence = Column(Float)
    detected_elements = Column(Text)                  # JSON-serialized list
    lighting_conditions = Column(String)
    
    status = Column(String, default="pending")        # pending, processing, completed, failed
    error_message = Column(String)
    
    # User interaction flags
    is_favorite = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)        # Shared publicly via link
    share_token = Column(String, unique=True, index=True)  # Unique share token for public URLs
    download_count = Column(Integer, default=0)
    
    # Performance tracking
    generation_time_ms = Column(Integer)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    @property
    def validation_score(self) -> Optional[float]:
        if not self.detected_elements:
            return None
        try:
            import json
            data = json.loads(self.detected_elements)
            if isinstance(data, dict) and "score" in data:
                return float(data["score"])
        except Exception:
            pass
        return None

    @property
    def validation_feedback(self) -> Optional[str]:
        if not self.detected_elements:
            return None
        try:
            import json
            data = json.loads(self.detected_elements)
            if isinstance(data, dict) and "feedback" in data:
                return str(data["feedback"])
        except Exception:
            pass
        return None

    project = relationship("Project", back_populates="designs")
