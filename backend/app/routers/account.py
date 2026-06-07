from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, validator

from app.database import get_db
from app.models.user import User
from app.services.token_service import (
    generate_password_reset_token,
    verify_password_reset_token,
    generate_email_verification_token,
    verify_email_token,
)
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import create_user
from app.middleware.auth import get_current_user
from app.config import settings


router = APIRouter()


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

    @validator("new_password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class EmailVerificationRequest(BaseModel):
    token: str


@router.post("/request-password-reset")
def request_password_reset(
    request: PasswordResetRequest, db: Session = Depends(get_db)
):
    """Request password reset email."""
    token, user = generate_password_reset_token(db, request.email)

    # In production, send email with reset link
    # For now, return the token directly (development only)
    if user:
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        print(f"[DEV] Password reset link for {user.email}: {reset_link}")
        return {
            "message": "If an account exists with that email, a reset link has been sent.",
            "dev_token": token,
        }
    else:
        return {
            "message": "If an account exists with that email, a reset link has been sent."
        }


@router.post("/reset-password")
def reset_password(
    request: PasswordResetConfirm, db: Session = Depends(get_db)
):
    """Reset password using token."""
    success = verify_password_reset_token(db, request.token, request.new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )
    return {"message": "Password reset successfully"}


@router.post("/request-verification")
def request_email_verification(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Request email verification."""
    if current_user.is_active:
        return {"message": "Email already verified"}

    token = generate_email_verification_token(current_user.id)
    verification_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    print(f"[DEV] Email verification link for {current_user.email}: {verification_link}")

    return {
        "message": "Verification email sent.",
        "dev_token": token,
    }


@router.post("/verify-email")
def verify_email(
    request: EmailVerificationRequest, db: Session = Depends(get_db)
):
    """Verify email using token."""
    success = verify_email_token(db, request.token)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )
    return {"message": "Email verified successfully"}
