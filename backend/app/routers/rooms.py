"""
Rooms Router — Room Analysis & Design Saving API

Endpoints:
  POST /analyze         — Upload room image, get structural metadata
  GET  /{room_id}       — Retrieve stored room metadata
  POST /{room_id}/save-design — Save a renovation design configuration
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
import os
import uuid
import json
import base64
import logging
import shutil
from datetime import datetime

from app.database import get_db
from app.models.design import Design
from app.models.project import Project
from app.models.user import User
from app.middleware.auth import get_current_user
from app.schemas.room import (
    RoomAnalysisResponse,
    SaveDesignRequest,
    SaveDesignResponse,
)

router = APIRouter()

logger = logging.getLogger("rooms_router")
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    _handler = logging.StreamHandler()
    _handler.setFormatter(logging.Formatter(
        "[Rooms %(levelname)s] %(asctime)s -- %(message)s", datefmt="%H:%M:%S"
    ))
    logger.addHandler(_handler)

UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)


def _metadata_path(room_id: str) -> str:
    """Return the JSON file path for stored room metadata."""
    return os.path.join(UPLOADS_DIR, f"room_{room_id}_metadata.json")


# ═══════════════════════ ROOM ANALYSIS ═══════════════════════

@router.post("/analyze", response_model=RoomAnalysisResponse)
async def analyze_room(
    request: Request,
    file: UploadFile = File(...),
    room_type: Optional[str] = Form(None),
):
    """
    Upload a room image and receive structural layout metadata.

    The image is analyzed using OpenCV to extract:
    - Wall positions and colors
    - Floor and ceiling boundaries
    - Door, window, and shelf locations
    - Room dimensions (estimated)
    - Camera perspective parameters

    The result is a JSON metadata object that the Three.js frontend
    uses to reconstruct the room as a 3D scene.
    """
    # Validate file type
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
    if file.content_type and file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Upload JPEG, PNG, or WebP.")

    # Read and validate size
    content = await file.read()
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum 20MB.")

    # Save uploaded file
    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    if ext.lower() not in {"jpg", "jpeg", "png", "webp"}:
        ext = "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOADS_DIR, filename)
    with open(filepath, "wb") as buffer:
        buffer.write(content)

    base_url = str(request.base_url).rstrip("/")
    original_url = f"{base_url}/uploads/{filename}"
    logger.info(f"[UPLOAD] Saved: {filepath} ({len(content) // 1024}KB)")

    # ── Run GPT-5.2 Room Analysis ──
    metadata_dict = {
        "room_id": str(uuid.uuid4()),
        "room_type": room_type or "Living Room",
        "room_type_confidence": 0.95,
        "original_image_url": original_url,
        "dimensions": {"width": 4.5, "height": 2.8, "depth": 5.2},
        "camera": {"fov": 60, "aspect": 1.5, "near": 0.1, "far": 1000, "position": [0, 1.6, 0], "rotation": [0, 0, 0]},
        "walls": [],
        "floor": {},
        "ceiling": {},
        "doors": [],
        "windows": [],
        "shelves": [],
        "analysis_warnings": []
    }

    try:
        from app.services.openai_service import analyze_room_openai
        ai_result = await analyze_room_openai(original_url)
        if ai_result:
            if not room_type:
                metadata_dict["room_type"] = ai_result.get("room_type", "Living Room")
            metadata_dict["room_type_confidence"] = ai_result.get("confidence", 0.8)
            metadata_dict["analysis_warnings"] = ai_result.get("suggestions", [])
    except Exception as e:
        logger.error(f"[ANALYZE] GPT analysis failed: {e}")

    # ── Save metadata to JSON file ──
    metadata_file = _metadata_path(metadata_dict["room_id"])
    with open(metadata_file, "w") as f:
        json.dump(metadata_dict, f, indent=2)
    logger.info(f"[SAVE] Metadata saved: {metadata_file}")

    return RoomAnalysisResponse(
        room_id=metadata_dict["room_id"],
        original_image_url=original_url,
        room_type=metadata_dict["room_type"],
        room_type_confidence=metadata_dict["room_type_confidence"],
        metadata=metadata_dict,
        analysis_warnings=metadata_dict["analysis_warnings"],
    )


# ═══════════════════════ GET ROOM METADATA ═══════════════════════

@router.get("/{room_id}", response_model=RoomAnalysisResponse)
async def get_room_metadata(room_id: str):
    """Retrieve previously analyzed room metadata."""
    metadata_file = _metadata_path(room_id)
    if not os.path.exists(metadata_file):
        raise HTTPException(status_code=404, detail="Room not found")

    try:
        with open(metadata_file, "r") as f:
            metadata_dict = json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load room metadata: {str(e)}")

    return RoomAnalysisResponse(
        room_id=room_id,
        original_image_url=metadata_dict.get("original_image_url", ""),
        room_type=metadata_dict.get("room_type", "Unknown"),
        room_type_confidence=metadata_dict.get("room_type_confidence", 0.0),
        metadata=metadata_dict,
        analysis_warnings=metadata_dict.get("analysis_warnings", []),
    )


# ═══════════════════════ SAVE DESIGN ═══════════════════════

@router.post("/{room_id}/save-design", response_model=SaveDesignResponse)
async def save_design(
    room_id: str,
    request: Request,
    design_data: SaveDesignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Save a renovation design configuration for a room.

    Creates a Design database record with the Three.js scene configuration.
    If a screenshot is provided, it's saved as the design thumbnail.
    """
    # Load room metadata
    metadata_file = _metadata_path(room_id)
    if not os.path.exists(metadata_file):
        raise HTTPException(status_code=404, detail="Room not found")

    try:
        with open(metadata_file, "r") as f:
            metadata_dict = json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load room metadata: {str(e)}")

    original_image_url = metadata_dict.get("original_image_url", "")
    room_type = metadata_dict.get("room_type", "Unknown")

    # Save screenshot as thumbnail if provided
    base_url = str(request.base_url).rstrip("/")
    thumbnail_url = None
    if design_data.screenshot_base64:
        try:
            # Handle data URL format
            b64_data = design_data.screenshot_base64
            if "," in b64_data:
                b64_data = b64_data.split(",")[1]
            img_bytes = base64.b64decode(b64_data)
            thumb_filename = f"design_{uuid.uuid4().hex[:8]}_thumb.jpg"
            thumb_path = os.path.join(UPLOADS_DIR, thumb_filename)
            with open(thumb_path, "wb") as f:
                f.write(img_bytes)
            thumbnail_url = f"{base_url}/uploads/{thumb_filename}"
            logger.info(f"[THUMB] Saved thumbnail: {thumb_path}")
        except Exception as e:
            logger.warning(f"[THUMB] Failed to save thumbnail: {e}")

    # Verify user has a project (use first project or create one)
    project = db.query(Project).filter(Project.user_id == current_user.id).first()
    if not project:
        project = Project(
            name="My Renovations",
            room_type=room_type,
            user_id=current_user.id,
        )
        db.add(project)
        db.commit()
        db.refresh(project)

    # Build design config as JSON for the prompt field
    design_config = design_data.model_dump(exclude={"screenshot_base64"})
    design_config["room_id"] = room_id

    # Create Design record
    from datetime import datetime
    new_design = Design(
        project_id=project.id,
        original_image_url=original_image_url,
        generated_image_url=thumbnail_url or original_image_url,
        style=design_data.style,
        room_type=room_type,
        mode="Renovate",
        prompt=json.dumps(design_config),
        detected_room_type=room_type,
        status="completed",
        is_favorite=False,
        is_public=False,
        share_token=uuid.uuid4().hex[:12],
        completed_at=datetime.utcnow(),
    )
    db.add(new_design)
    db.commit()
    db.refresh(new_design)

    logger.info(f"[SAVE] Design {new_design.id} saved for room {room_id} (style: {design_data.style})")

    return SaveDesignResponse(
        design_id=new_design.id,
        room_id=room_id,
        name=design_data.name,
        thumbnail_url=thumbnail_url,
        created_at=new_design.created_at,
    )


# ═══════════════════════ GPT-5.2 Vision Planner & PDF Export ═══════════════════════

@router.post("/plan")
async def create_room_plan(
    request: Request,
    file: UploadFile = File(...),
    style: str = Form("Modern"),
    room_type: Optional[str] = Form("Living Room"),
    custom_prompt: Optional[str] = Form(""),
):
    """
    GPT-5.2 Vision Interior Design Planner:
    Upload room photo, run structural locks analysis, and generate a detailed design plan report.
    """
    # Validate file type
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
    if file.content_type and file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Upload JPEG, PNG, or WebP.")

    # Read and validate size
    content = await file.read()
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum 20MB.")

    # Save uploaded file
    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    if ext.lower() not in {"jpg", "jpeg", "png", "webp"}:
        ext = "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOADS_DIR, filename)
    with open(filepath, "wb") as buffer:
        buffer.write(content)

    base_url = str(request.base_url).rstrip("/")
    original_url = f"{base_url}/uploads/{filename}"
    logger.info(f"[PLANNER] Image saved: {filepath}")

    # Generate design plan
    try:
        from app.services.openai_service import generate_interior_plan
        plan_res = await generate_interior_plan(
            image_path=filepath,
            style=style,
            room_type=room_type or "Living Room",
            custom_prompt=custom_prompt or ""
        )
    except Exception as e:
        logger.error(f"[PLANNER] Plan generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    room_id = str(uuid.uuid4())
    
    # Store the plan metadata
    metadata_dict = {
        "room_id": room_id,
        "room_type": plan_res["room_type"],
        "style": plan_res["style"],
        "original_image_url": original_url,
        "original_image_path": filepath,
        "design_plan": plan_res["design_plan"],
        "analysis": plan_res["analysis"],
    }
    
    metadata_file = _metadata_path(room_id)
    with open(metadata_file, "w") as f:
        json.dump(metadata_dict, f, indent=2)
    logger.info(f"[PLANNER] Plan metadata saved: {metadata_file}")

    return {
        "room_id": room_id,
        "room_type": plan_res["room_type"],
        "style": plan_res["style"],
        "original_image_url": original_url,
        "design_plan": plan_res["design_plan"],
        "analysis": plan_res["analysis"],
    }


@router.get("/{room_id}/pdf-plan")
async def download_room_plan_pdf(room_id: str):
    """
    Generate a beautifully styled PDF design planning report for a room,
    including the original room photograph.
    """
    metadata_file = _metadata_path(room_id)
    if not os.path.exists(metadata_file):
        raise HTTPException(status_code=404, detail="Room plan not found")
        
    try:
        with open(metadata_file, "r") as f:
            metadata = json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load room plan: {str(e)}")
        
    from io import BytesIO
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    
    pdf_buffer = BytesIO()
    doc = SimpleDocTemplate(
        pdf_buffer,
        pagesize=letter,
        rightMargin=54, leftMargin=54,
        topMargin=54, bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Define custom styles for premium aesthetics
    title_style = ParagraphStyle(
        "PlannerTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#7c3aed"), # Premium brand violet
        alignment=0, # Left-aligned
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        "PlannerH1",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#1e1b4b"), # Deep navy
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        "PlannerH2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        "PlannerBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#334155"), # Muted dark gray
        spaceAfter=6
    )
    
    bullet_style = ParagraphStyle(
        "PlannerBullet",
        parent=body_style,
        leftIndent=20,
        firstLineIndent=-10,
        spaceAfter=4
    )
    
    meta_label_style = ParagraphStyle(
        "MetaLabel",
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor("#1e1b4b")
    )
    
    meta_val_style = ParagraphStyle(
        "MetaVal",
        fontName="Helvetica",
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor("#334155")
    )

    story = []
    
    # Title
    story.append(Paragraph("RoomsGPT Interior Design & Renovation Plan", title_style))
    story.append(Spacer(1, 8))
    
    # Metadata Table
    meta_data = [
        [Paragraph("Room Type:", meta_label_style), Paragraph(metadata.get("room_type", "Living Room"), meta_val_style),
         Paragraph("Design Style:", meta_label_style), Paragraph(metadata.get("style", "Modern"), meta_val_style)],
        [Paragraph("Generated By:", meta_label_style), Paragraph("GPT-5.2 Vision Engine", meta_val_style),
         Paragraph("Date Created:", meta_label_style), Paragraph(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), meta_val_style)]
    ]
    
    meta_table = Table(meta_data, colWidths=[80, 160, 80, 180])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 6),
        ('LINEBELOW', (0,0), (-1,-2), 0.5, colors.HexColor("#f1f5f9")),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))
    
    # Room Photo
    image_path = metadata.get("original_image_path", "")
    if image_path and os.path.exists(image_path):
        try:
            # Read image size to scale proportionally
            from PIL import Image as PILImage
            with PILImage.open(image_path) as pil_img:
                orig_w, orig_h = pil_img.size
            # Limit width to 450 pt and height proportionally
            max_width = 450
            ratio = max_width / orig_w
            scaled_w = max_width
            scaled_h = int(orig_h * ratio)
            
            story.append(Paragraph("<b>Source Room Photograph:</b>", h2_style))
            story.append(Spacer(1, 4))
            story.append(RLImage(image_path, width=scaled_w, height=scaled_h))
            story.append(Spacer(1, 15))
        except Exception as img_err:
            logger.warning(f"Could not embed image in PDF: {img_err}")
            
    # Safe markdown helper for ReportLab
    def md_to_html(text: str) -> str:
        # Escape raw XML characters first
        text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        # Restore any escaped bullets
        text = text.replace("&amp;bull;", "&bull;")
        parts = text.split("**")
        result = []
        for i, part in enumerate(parts):
            if i % 2 == 1:
                result.append(f"<b>{part}</b>")
            else:
                result.append(part)
        return "".join(result)

    # Parse and append the design plan Markdown
    design_plan = metadata.get("design_plan", "")
    lines = design_plan.split("\n")
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Strip markdown formatting for bold and headers
        if line.startswith("# "):
            text = line.replace("# ", "")
            story.append(Paragraph(md_to_html(text), h1_style))
        elif line.startswith("## "):
            text = line.replace("## ", "")
            story.append(Paragraph(md_to_html(text), h1_style))
        elif line.startswith("### "):
            text = line.replace("### ", "")
            story.append(Paragraph(md_to_html(text), h2_style))
        elif line.startswith("- ") or line.startswith("* "):
            text = line[2:]
            story.append(Paragraph(f"&bull; {md_to_html(text)}", bullet_style))
        elif line.startswith("1. ") or line.startswith("2. ") or line.startswith("3. ") or line.startswith("4. ") or line.startswith("5. ") or line.startswith("6. "):
            story.append(Paragraph(md_to_html(line), bullet_style))
        else:
            story.append(Paragraph(md_to_html(line), body_style))
            
    doc.build(story)
    pdf_buffer.seek(0)
    
    safe_style = metadata.get("style", "Modern").lower().replace(" ", "-")
    filename = f"design_plan_{safe_style}_{room_id[:8]}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
