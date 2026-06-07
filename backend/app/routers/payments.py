from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from sqlalchemy.orm import Session
import stripe
from typing import Optional
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.middleware.auth import get_current_user
from app.schemas.user import UserResponse
from app.services.payment_service import (
    create_checkout_session,
    handle_checkout_completed,
    get_subscription_details,
    create_customer_portal_session,
)
# removed invalid import
from app.config import settings

router = APIRouter()


class CheckoutRequest(BaseModel):
    price_id: str
    plan_name: str

@router.post("/create-checkout-session")
async def create_checkout(
    request: CheckoutRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Create Stripe Checkout session for subscription.
    """
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment system not configured",
        )

    try:
        success_url = f"{settings.FRONTEND_URL}/pricing?success=true"
        cancel_url = f"{settings.FRONTEND_URL}/pricing?cancelled=true"

        result = create_checkout_session(
            user_email=current_user.email,
            user_id=current_user.id,
            price_id=request.price_id,
            plan_name=request.plan_name,
            success_url=success_url,
            cancel_url=cancel_url,
        )
        return {"checkout_url": result["url"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/create-customer-portal")
async def create_portal_session(
    current_user: User = Depends(get_current_user),
):
    """
    Create billing portal session for subscription management.
    """
    if not current_user.stripe_customer_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No subscription found",
        )

    try:
        return_url = f"{settings.FRONTEND_URL}/dashboard"
        portal_url = create_customer_portal_session(
            customer_id=current_user.stripe_customer_id,
            return_url=return_url,
        )
        return {"portal_url": portal_url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/stripe-webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Handle Stripe webhook events.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle different event types
    event_type = event["type"]

    if event_type == "checkout.session.completed":
        session = event["data"]["object"]
        subscription_id = session.get("subscription")

        # Get subscription details to determine plan
        if subscription_id:
            subscription = stripe.Subscription.retrieve(subscription_id)
            price_id = subscription.items.data[0].price.id

            # Map price ID to plan name (should match your Stripe prices)
            plan_map = {
                settings.STRIPE_PRICE_STARTER: "starter",
                settings.STRIPE_PRICE_PROFESSIONAL: "professional",
                settings.STRIPE_PRICE_BUSINESS: "business",
            }
            plan = plan_map.get(price_id, "starter")

            # Update user
            data = handle_checkout_completed(session)
            user = db.query(User).filter(User.id == data["user_id"]).first()
            if user:
                user.plan = plan
                user.credits += data["credits"]
                user.stripe_customer_id = data["stripe_customer_id"]
                user.stripe_subscription_id = data["stripe_subscription_id"]
                user.subscription_status = data["status"]
                db.commit()
        else:
            # One-time payment (not used in this app)
            pass

    elif event_type == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        customer_id = subscription["customer"]
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            user.subscription_status = "cancelled"
            user.plan = "free"
            db.commit()

    elif event_type == "customer.subscription.updated":
        subscription = event["data"]["object"]
        customer_id = subscription["customer"]
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            user.subscription_status = subscription["status"]
            if subscription["status"] != "active":
                user.plan = "free"
            db.commit()

    elif event_type == "invoice.payment_failed":
        invoice = event["data"]["object"]
        customer_id = invoice["customer"]
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            user.subscription_status = "past_due"
            db.commit()

    return {"status": "success"}


@router.get("/subscription")
async def get_subscription(current_user: User = Depends(get_current_user)):
    """
    Get current user's subscription details.
    """
    if not current_user.stripe_customer_id:
        return {
            "plan": current_user.plan,
            "status": None,
            "subscription": None,
        }

    sub_details = get_subscription_details(current_user.stripe_customer_id)
    return {
        "plan": current_user.plan,
        "status": current_user.subscription_status,
        "subscription": sub_details,
    }
