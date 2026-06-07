import httpx
import asyncio
from typing import Optional
from app.config import settings

async def generate_advanced_design(
    image_url: str,
    mask_url: Optional[str] = None,
    mode: str = "redesign",
    prompt: str = "",
    color_palette: str = "Auto",
) -> str:
    """
    Advanced AI generation utilizing different models based on the studio 'mode'.
    Supports masking for targeted replacement (Magic Erase / Item Swap).
    """
    if not settings.REPLICATE_API_TOKEN:
        # Development Mock Mode
        await asyncio.sleep(2)
        print(f"[AI SIMULATION] Mode: {mode} | Palette: {color_palette} | Mask: {'Yes' if mask_url else 'No'}")
        return "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80"
    
    # Precise, actual Replicate model hashes
    CONTROLNET_MODEL = "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b" # jagilley/controlnet-hough
    INPAINTING_MODEL = "c28b92a2a0d0a75f8fdf12720fb97cc0aa617c5b6ae06450f384a5db20cbca90" # stability-ai/stable-diffusion-inpainting
    
    model_version = INPAINTING_MODEL if mask_url else CONTROLNET_MODEL
    
    async with httpx.AsyncClient() as client:
        headers = {
            "Authorization": f"Token {settings.REPLICATE_API_TOKEN}",
            "Content-Type": "application/json"
        }
        
        enhanced_prompt = f"Professional interior design photography, {prompt}, ultra realistic, 4k, architectural digest style. Color theme: {color_palette}."
        
        payload = {
            "version": model_version,
            "input": {
                "image": image_url,
                "prompt": enhanced_prompt,
                "a_prompt": "best quality, extremely detailed",
                "n_prompt": "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
            }
        }
        
        if mask_url:
            payload["input"]["mask"] = mask_url
            # Inpainting models usually require 'image' as the init image and 'mask' as the masking layer
            
        # Execute prediction
        try:
            response = await client.post(
                "https://api.replicate.com/v1/predictions",
                headers=headers,
                json=payload
            )
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            error_data = e.response.text
            raise Exception(f"AI Provider error: {error_data}")

        prediction = response.json()
        pred_url = prediction["urls"]["get"]
        
        # Poll for completion safely
        while True:
            await asyncio.sleep(1.5)
            poll_resp = await client.get(pred_url, headers=headers)
            poll_data = poll_resp.json()
            
            status = poll_data.get("status")
            if status == "succeeded":
                output = poll_data.get("output")
                if not output:
                    raise Exception("AI Generation succeeded but returned empty output.")
                # Handle single string vs list of strings
                return output[1] if isinstance(output, list) and len(output) > 1 else (output[0] if isinstance(output, list) else output)
            elif status in ["failed", "canceled"]:
                error_msg = poll_data.get("error", "Unknown error")
                raise Exception(f"AI Generation {status}: {error_msg}")
