"""
AI Interior Design Service -- GPT-5.2 + gpt-image-2 Renovation Engine
"""

import os
import logging
from typing import Optional

from app.services import openai_service

logger = logging.getLogger("ai_service")
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    _handler = logging.StreamHandler()
    _handler.setFormatter(logging.Formatter(
        "[AI %(levelname)s] %(asctime)s -- %(message)s", datefmt="%H:%M:%S"
    ))
    logger.addHandler(_handler)

UPLOADS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads"
)
os.makedirs(UPLOADS_DIR, exist_ok=True)

# ======================= STYLE DEFINITIONS =======================
STYLE_PRESETS = {
    "Modern": {
        "description": "Clean lines, neutral palette, polished surfaces, sleek contemporary furniture",
        "prompt_keywords": "sleek contemporary furniture, clean geometric lines, neutral color palette with bold accents, polished chrome and glass, minimalist decor"
    },
    "Minimalist": {
        "description": "Clean, uncluttered, serene simplicity, functional styling",
        "prompt_keywords": "extreme simplicity, clutter-free surfaces, low-profile functional furniture, neutral shades of white, beige and gray, airy open space layout"
    },
    "Luxury": {
        "description": "Marble, gold accents, crystal lighting, opulent premium materials",
        "prompt_keywords": "premium marble surfaces, gold accent fixtures, crystal chandelier lighting, rich velvet upholstery, ornate details, high-end bespoke luxury design"
    },
    "Scandinavian": {
        "description": "Light wood, cozy textiles, hygge warmth, soft natural tones",
        "prompt_keywords": "light-toned oak wood, soft knitted textiles, organic linen fabrics, cozy minimalist aesthetic, bright white and pastel tones, potted greenery"
    },
    "Rustic": {
        "description": "Reclaimed wood, stone, countryside warmth, vintage elements",
        "prompt_keywords": "exposed wooden beams, reclaimed barn wood furniture, rough stone accents, warm copper fixtures, cozy earthy tones, comfortable traditional seating"
    },
    "Contemporary": {
        "description": "State-of-the-art styling, organic curves, bold textures, sophisticated lighting",
        "prompt_keywords": "curved organic furniture, high-contrast textures, state-of-the-art designer light fixtures, bold statement art pieces, sophisticated modern layout"
    },
    "Industrial": {
        "description": "Raw brick, metal fixtures, exposed elements, loft-style layout",
        "prompt_keywords": "raw brick wall textures, black metal fixtures, exposed pipes and ductwork, leather seating, concrete flooring, industrial cage pendant lights"
    },
    "Traditional": {
        "description": "Timeless elegance, rich dark wood, classic symmetry, refined detailing",
        "prompt_keywords": "rich mahogany wood cabinets, classic symmetrical furniture layout, refined traditional molding, elegant fabrics with classic patterns, warm brass lamps"
    }
}

ROOM_TYPES = [
    "Living Room", "Bedroom", "Kitchen", "Bathroom",
    "Dining Room", "Office", "Kids Room", "Storage Room", "Pantry"
]

logger.info("===================================================")
logger.info("[OK] AI Service: GPT-5.2 Renovation Engine")
logger.info(f"   [BRAIN] Analysis: OpenAI GPT-5.2")
logger.info(f"   [IMAGE] Generation: OpenAI gpt-image-2")
logger.info(f"   Styles: {len(STYLE_PRESETS)} available")
logger.info(f"   Room types: {len(ROOM_TYPES)} available")
logger.info("===================================================")


# ======================= AI STATUS =======================

async def ai_status() -> dict:
    """Return AI engine status for the /ai-status health endpoint."""
    from app.services.image_generation_layer import image_provider
    image_client_available = image_provider.is_available()
    active_providers = image_provider.get_active_provider_names()
    
    result = {
        "engine": "gpt52-renovation" if image_client_available else "gpt52-analysis-only",
        "room_analyzer": "gpt52-vision",
        "text_analysis": "gpt52",
        "status": "ready",
        "rendering": ", ".join(active_providers) if image_client_available else "unavailable",
        "structural_analysis": "gpt-5.2-vision (server-side)",
        "styles_available": len(STYLE_PRESETS),
        "room_types_available": len(ROOM_TYPES),
        "supported_styles": list(STYLE_PRESETS.keys()),
        "supported_room_types": ROOM_TYPES,
        "features": [
            "renovation",
            "style_preset",
            "before_after_comparison",
            "download_image",
        ] if image_client_available else [
            "analysis",
            "style_preset"
        ],
        "cost_per_design": "$0.05" if image_client_available else "$0.00",
        "active_providers": active_providers,
    }

    try:
        openai_info = await openai_service.openai_status()
        result["openai_provider"] = openai_info
    except Exception as e:
        result["openai_provider"] = {"status": "error", "error": str(e)[:100]}

    return result


# ======================= ROOM ANALYSIS =======================

async def analyze_room(image_url: str) -> dict:
    """
    Analyze an uploaded room image to detect its room type and style.
    """
    filename = image_url.split("/")[-1].lower().split("?")[0]

    # 1. Keyword match in filename
    keyword_map = {
        "bedroom": "Bedroom",
        "kitchen": "Kitchen",
        "bathroom": "Bathroom",
        "living": "Living Room",
        "dining": "Dining Room",
        "office": "Office",
        "kids": "Kids Room",
        "storage": "Storage Room",
        "pantry": "Pantry",
    }
    for kw, room in keyword_map.items():
        if kw in filename:
            logger.info(f"[DETECT] Keyword '{kw}' matched in filename -> {room}")
            return {"room_type": room, "detected_style": "Unknown",
                    "objects_detected": [], "confidence": 0.90}

    # 2. OpenAI vision analysis
    try:
        analysis = await openai_service.analyze_room_openai(image_url)
        if analysis and analysis.get("room_type"):
            room_type = analysis.get("room_type", "Unknown")
            confidence = analysis.get("confidence", 0.7)
            logger.info(f"[DETECT] OpenAI detected: {room_type} ({int(confidence * 100)}%)")
            return {
                "room_type": room_type,
                "detected_style": analysis.get("detected_style", "Unknown"),
                "objects_detected": analysis.get("objects_detected", []),
                "confidence": confidence,
                "suggestions": analysis.get("suggestions", []),
            }
    except Exception as e:
        logger.warning(f"[DETECT] OpenAI analysis failed (non-fatal): {e}")

    # 3. Fallback
    logger.info("[DETECT] No detection method succeeded. Returning Unknown.")
    return {
        "room_type": "Unknown",
        "detected_style": "Unknown",
        "objects_detected": [],
        "confidence": 0.0,
    }


# ======================= STYLE SUGGESTIONS =======================

async def get_style_suggestions(room_type: str = "", current_style: str = "") -> dict:
    """
    Get style preset details and AI-powered suggestions for a room.
    """
    result = {
        "available_styles": STYLE_PRESETS,
        "room_type": room_type,
        "suggestions": [],
    }

    try:
        ai_suggestions = await openai_service.get_design_suggestions(
            room_type=room_type,
            current_style=current_style,
        )
        if ai_suggestions:
            result["suggestions"] = ai_suggestions
    except Exception as e:
        logger.warning(f"[SUGGEST] AI suggestions failed (non-fatal): {e}")

    return result


# ======================= PHOTOREALISTIC DESIGN GENERATION =======================

async def generate_renovation(
    image_path: str,
    style: str,
    room_type: str = "",
    custom_prompt: str = "",
) -> dict:
    """
    Call openai_service.generate_room_renovation() and return the result.
    """
    return await openai_service.generate_room_renovation(
        image_path=image_path,
        style=style,
        room_type=room_type,
        custom_prompt=custom_prompt,
    )
