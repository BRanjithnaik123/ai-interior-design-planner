from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, Request, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
import os, uuid, shutil, base64, json, time, httpx, io

from app.database import get_db
from app.schemas.design import (
    DesignCreate, DesignResponse, DesignUpdateRequest,
    DesignPublicResponse, RoomAnalysisResponse, GalleryDesignResponse,
)
from app.models.design import Design
from app.models.project import Project
from app.models.user import User
from app.middleware.auth import get_current_user
from app.services.ai_service import analyze_room

router = APIRouter()

UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")


# Image upload endpoints

@router.post("/upload-image")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload an image and return its publicly accessible URL."""
    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOADS_DIR, filename)

    os.makedirs(UPLOADS_DIR, exist_ok=True)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    base_url = str(request.base_url).rstrip("/")
    image_url = f"{base_url}/uploads/{filename}"
    return {"image_url": image_url, "filename": filename}


@router.post("/upload-mask")
async def upload_mask(
    request: Request,
    file: UploadFile = File(None),
    mask_data: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
):
    """Upload a mask image — either as a file upload or a base64 data URL from the canvas."""
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    filename = f"mask_{uuid.uuid4()}.png"
    filepath = os.path.join(UPLOADS_DIR, filename)

    if file:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    elif mask_data:
        if "," in mask_data:
            mask_data = mask_data.split(",")[1]
        img_bytes = base64.b64decode(mask_data)
        with open(filepath, "wb") as f:
            f.write(img_bytes)
    else:
        raise HTTPException(status_code=400, detail="No mask data provided")

    base_url = str(request.base_url).rstrip("/")
    mask_url = f"{base_url}/uploads/{filename}"
    return {"mask_url": mask_url, "filename": filename}


# Room analysis

@router.post("/analyze", response_model=RoomAnalysisResponse)
async def analyze_room_endpoint(
    request: Request,
    image_url: str = Form(...),
    current_user: User = Depends(get_current_user),
):
    """Analyze an uploaded room image to detect room type and features."""
    try:
        analysis = await analyze_room(image_url)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Demo design generation (no auth required)

@router.post("/demo-generate")
async def demo_generate(
    request: Request,
    file: UploadFile = File(...),
    style: str = Form("Modern"),
    room_type: str = Form("Living Room"),
    custom_prompt: str = Form(""),
):
    """
    Public demo endpoint — runs structural analysis and gpt-image-2 interior renovation,
    saving the renovated image and returning a consolidated response.
    """
    # Validate file type
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
    if file.content_type and file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload JPEG, PNG, or WebP.")

    # 1. Save the uploaded file locally
    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    if ext.lower() not in {"jpg", "jpeg", "png", "webp"}:
        ext = "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOADS_DIR, filename)
    os.makedirs(UPLOADS_DIR, exist_ok=True)

    MAX_SIZE = 20 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 20MB.")
    with open(filepath, "wb") as buffer:
        buffer.write(content)

    base_url = str(request.base_url).rstrip("/")
    original_url = f"{base_url}/uploads/{filename}"

    # 2. Call AI renovation pipeline
    analysis = {}
    validation = {}
    generated_url = original_url
    prompt_used = ""

    try:
        from app.services.ai_service import generate_renovation
        result = await generate_renovation(
            image_path=filepath,
            style=style,
            room_type=room_type,
            custom_prompt=custom_prompt
        )
        
        analysis = result.get("analysis", {})
        validation = result.get("validation", {})
        prompt_used = result.get("prompt_used", "")
        
        image_base64 = result.get("image_base64")
        if image_base64:
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]
            img_data = base64.b64decode(image_base64)
            gen_filename = f"renovated_{uuid.uuid4()}.png"
            gen_filepath = os.path.join(UPLOADS_DIR, gen_filename)
            with open(gen_filepath, "wb") as f:
                f.write(img_data)
            generated_url = f"{base_url}/uploads/{gen_filename}"
            
    except Exception as e:
        print(f"[DEMO] AI generation pipeline failed: {e}")
        # Return fallback values
        validation = {"status": "error", "error": str(e), "preserved": False}

    return {
        "original_url": original_url,
        "generated_url": generated_url,
        "style": style,
        "room_type": room_type,
        "analysis": analysis,
        "validation": validation,
        "prompt_used": prompt_used,
        "engine": "gpt52-renovation"
    }


# Authenticated design creation

@router.post("/", response_model=DesignResponse)
async def create_design_endpoint(
    request: Request,
    design_in: DesignCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify project belongs to user
    project = db.query(Project).filter(Project.id == design_in.project_id).first()
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check credits
    if current_user.credits <= 0:
        raise HTTPException(status_code=402, detail="Not enough credits. Please upgrade your plan.")

    # Deduct credit
    current_user.credits -= 1

    # Create design record with status processing
    new_design = Design(
        project_id=design_in.project_id,
        original_image_url=design_in.original_image_url,
        style=design_in.style,
        room_type=design_in.room_type,
        mode=design_in.mode,
        prompt=design_in.prompt,
        status="processing",
        share_token=uuid.uuid4().hex[:12],
    )
    db.add(new_design)
    db.commit()
    db.refresh(new_design)

    # 1. Resolve image source
    image_src = design_in.original_image_url
    if "uploads/" in image_src:
        filename = image_src.split("uploads/")[-1]
        local_path = os.path.join(UPLOADS_DIR, filename)
        if os.path.exists(local_path):
            image_src = local_path

    # 2. Run renovation
    try:
        from app.services.ai_service import generate_renovation
        start_time = time.time()
        result = await generate_renovation(
            image_path=image_src,
            style=design_in.style,
            room_type=design_in.room_type,
            custom_prompt=design_in.prompt or ""
        )
        duration_ms = int((time.time() - start_time) * 1000)

        image_base64 = result.get("image_base64")
        if image_base64:
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]
            img_data = base64.b64decode(image_base64)
            gen_filename = f"renovated_{uuid.uuid4()}.png"
            gen_filepath = os.path.join(UPLOADS_DIR, gen_filename)
            with open(gen_filepath, "wb") as f:
                f.write(img_data)
            
            base_url = str(request.base_url).rstrip("/")
            new_design.generated_image_url = f"{base_url}/uploads/{gen_filename}"
            
            # Save structural info and validation results
            analysis = result.get("analysis", {})
            validation = result.get("validation", {})
            score = validation.get("score", 1.0)
            
            new_design.detected_elements = json.dumps(validation)
            new_design.detected_room_type = analysis.get("room_type", design_in.room_type)
            new_design.analysis_confidence = 0.95
            new_design.lighting_conditions = analysis.get("ceiling_floor", "Standard")
            new_design.generation_time_ms = duration_ms
            
            if score < 0.80:
                new_design.status = "failed"
                new_design.error_message = f"Room structure changed too heavily (Similarity: {int(score * 100)}%)."
            else:
                new_design.status = "completed"
        else:
            new_design.status = "failed"
            new_design.error_message = "No image returned from generation API"
            
    except Exception as e:
        new_design.status = "failed"
        new_design.error_message = str(e)

    db.commit()
    db.refresh(new_design)
    return new_design


# Get design details

@router.get("/{design_id}", response_model=DesignResponse)
def get_design(
    design_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    design = db.query(Design).filter(Design.id == design_id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    project = db.query(Project).filter(Project.id == design.project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Design not found")
    return design


@router.get("/project/{project_id}", response_model=list[DesignResponse])
def get_designs_by_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    designs = db.query(Design).filter(Design.project_id == project_id).order_by(Design.created_at.desc()).all()
    return designs


# User gallery listing

@router.get("/gallery/my", response_model=list[GalleryDesignResponse])
def get_my_gallery(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    favorites_only: bool = False,
    limit: int = 50,
    offset: int = 0,
):
    """Get all completed designs for the current user, optionally filtered to favorites."""
    query = (
        db.query(Design)
        .join(Project)
        .filter(Project.user_id == current_user.id, Design.status == "completed")
    )
    if favorites_only:
        query = query.filter(Design.is_favorite == True)
    
    designs = query.order_by(Design.created_at.desc()).offset(offset).limit(limit).all()
    return designs


# Favorite and save status update

@router.patch("/{design_id}", response_model=DesignResponse)
def update_design(
    design_id: int,
    update: DesignUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update design properties (favorite, public sharing)."""
    design = db.query(Design).filter(Design.id == design_id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    project = db.query(Project).filter(Project.id == design.project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Design not found")
    
    if update.is_favorite is not None:
        design.is_favorite = update.is_favorite
    if update.is_public is not None:
        design.is_public = update.is_public
        # Generate share token if enabling public access
        if update.is_public and not design.share_token:
            design.share_token = uuid.uuid4().hex[:12]
    
    db.commit()
    db.refresh(design)
    return design


# Public design sharing

@router.get("/share/{share_token}", response_model=DesignPublicResponse)
def get_shared_design(
    share_token: str,
    db: Session = Depends(get_db),
):
    """Get a publicly shared design (no auth required)."""
    design = db.query(Design).filter(
        Design.share_token == share_token,
        Design.is_public == True,
        Design.status == "completed",
    ).first()
    if not design:
        raise HTTPException(status_code=404, detail="Shared design not found or is no longer public")
    return design


# Download design image

@router.get("/{design_id}/download")
async def download_design(
    design_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Download the generated image. Increments download counter."""
    design = db.query(Design).filter(Design.id == design_id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    project = db.query(Project).filter(Project.id == design.project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Design not found")
    if not design.generated_image_url:
        raise HTTPException(status_code=400, detail="Design has no generated image yet")
    
    # Increment download counter
    design.download_count = (design.download_count or 0) + 1
    db.commit()

    # If URL is a local file, serve it directly
    url = design.generated_image_url
    if "/uploads/" in url:
        filename_part = url.split("/uploads/")[-1]
        filepath = os.path.join(UPLOADS_DIR, filename_part)
        if os.path.exists(filepath):
            def file_iterator():
                with open(filepath, "rb") as f:
                    yield from iter(lambda: f.read(65536), b"")
            
            safe_style = design.style.lower().replace(" ", "-")
            download_name = f"designai-{safe_style}-{design.id}.jpg"
            return StreamingResponse(
                file_iterator(),
                media_type="image/jpeg",
                headers={"Content-Disposition": f'attachment; filename="{download_name}"'}
            )

    # Otherwise proxy the remote URL
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            safe_style = design.style.lower().replace(" ", "-")
            download_name = f"designai-{safe_style}-{design.id}.jpg"
            return StreamingResponse(
                io.BytesIO(resp.content),
                media_type=resp.headers.get("content-type", "image/jpeg"),
                headers={"Content-Disposition": f'attachment; filename="{download_name}"'}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")


# Delete design

@router.delete("/{design_id}")
def delete_design(
    design_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a design owned by the user."""
    design = db.query(Design).filter(Design.id == design_id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    project = db.query(Project).filter(Project.id == design.project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Design not found")
    
    db.delete(design)
    db.commit()
    return {"message": "Design deleted successfully"}
