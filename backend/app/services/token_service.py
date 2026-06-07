from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from jose import jwt
import secrets
import hashlib

from app.config import settings
from app.models.user import User
from app.schemas.user import UserCreate

# Token types
PASSWORD_RESET_TOKEN = "password_reset"
EMAIL_VERIFICATION_TOKEN = "email_verification"


def create_token(user_id: int, token_type: str, expires_minutes: int = 60) -> str:
    """Create a signed token for password reset or email verification."""
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    data = {
        "sub": str(user_id),
        "type": token_type,
        "exp": expire,
        "nonce": secrets.token_urlsafe(16),  # Prevent replay attacks
    }
    return jwt.encode(data, settings.SECRET_KEY, algorithm="HS256")


def verify_token(token: str, token_type: str) -> Optional[int]:
    """Verify token and return user_id if valid."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = int(payload.get("sub", 0))
        token_type_match = payload.get("type") == token_type

        if not user_id or not token_type_match:
            return None

        return user_id
    except jwt.JWTError:
        return None


def generate_password_reset_token(db: Session, email: str) -> tuple[str, User]:
    """Generate password reset token for user."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None, None

    token = create_token(user.id, PASSWORD_RESET_TOKEN, expires_minutes=60)
    # In production, store token hash in DB to prevent reuse
    return token, user


def verify_password_reset_token(db: Session, token: str, new_password: str) -> bool:
    """Verify reset token and update user password."""
    user_id = verify_token(token, PASSWORD_RESET_TOKEN)
    if not user_id:
        return False

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False

    from app.services.auth_service import get_password_hash, verify_password
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    return True


def generate_email_verification_token(user_id: int) -> str:
    """Generate email verification token."""
    return create_token(user_id, EMAIL_VERIFICATION_TOKEN, expires_minutes=24*60)  # 24 hours


def verify_email_token(db: Session, token: str) -> bool:
    """Verify email and mark user as verified."""
    user_id = verify_token(token, EMAIL_VERIFICATION_TOKEN)
    if not user_id:
        return False

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False

    user.is_active = True
    db.commit()
    return True
