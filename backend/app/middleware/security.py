from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time

from app.config import settings


# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

        # Content-Security-Policy (adjust as needed for your frontend)
        if settings.ENVIRONMENT == "production":
            csp = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https: blob:; "
                "font-src 'self' data:; "
                "connect-src 'self' https://api.stripe.com https://*.replicate.com https://api.openai.com; "
                "frame-src 'self' https://js.stripe.com https://hooks.stripe.com; "
                "worker-src 'self' blob:; "
            )
            response.headers["Content-Security-Policy"] = csp

        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log request details and timing."""

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        response = await call_next(request)

        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)

        # Log request details (in production, use proper logging)
        if settings.ENVIRONMENT == "development":
            print(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")

        return response


def setup_middleware(app: FastAPI):
    """Configure all middleware for the application."""

    # Rate limiting (exclude health check and static files)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Security headers
    app.add_middleware(SecurityHeadersMiddleware)

    # Request logging
    app.add_middleware(RequestLoggingMiddleware)

    # HTTPS redirect in production only
    if settings.ENVIRONMENT == "production":
        app.add_middleware(HTTPSRedirectMiddleware)

    # CORS - configured in main.py based on environment
