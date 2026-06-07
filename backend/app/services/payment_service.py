import stripe
from typing import Optional, Dict, Any
from app.config import settings

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

# Stripe Price IDs (to be set in environment variables or Stripe dashboard)
STRIPE_PRICES = {
    "starter": settings.STRIPE_PRICE_STARTER,
    "professional": settings.STRIPE_PRICE_PROFESSIONAL,
    "business": settings.STRIPE_PRICE_BUSINESS,
}

# Credit allocations per plan
PLAN_CREDITS = {
    "starter": 300,
    "professional": 700,
    "business": 3000,
}


def create_checkout_session(
    user_email: str,
    user_id: int,
    price_id: str,
    plan_name: str,
    success_url: str,
    cancel_url: str,
) -> Dict[str, Any]:
    """
    Create a Stripe Checkout session for subscription purchase.
    """
    if not settings.STRIPE_SECRET_KEY or not settings.STRIPE_WEBHOOK_SECRET:
        raise ValueError("Stripe configuration missing")

    # Create or retrieve Stripe customer
    customer = get_or_create_customer(user_email, user_id)

    session = stripe.checkout.Session.create(
        customer=customer.id,
        payment_method_types=["card"],
        line_items=[
            {
                "price": price_id,
                "quantity": 1,
            }
        ],
        mode="subscription",
        success_url=f"{success_url}?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=cancel_url,
        metadata={
            "user_id": str(user_id),
            "plan": plan_name,
        },
        allow_promotion_codes=True,
    )

    return {
        "session_id": session.id,
        "url": session.url,
    }


def get_or_create_customer(user_email: str, user_id: int) -> stripe.Customer:
    """
    Get existing Stripe customer by email or create new one.
    In production, you'd store stripe_customer_id in user model.
    """
    # Search for existing customer by email
    customers = stripe.Customer.list(email=user_email, limit=1)
    if customers.data:
        return customers.data[0]

    # Create new customer
    customer = stripe.Customer.create(
        email=user_email,
        metadata={"user_id": str(user_id)},
    )
    return customer


def handle_checkout_completed(session: stripe.checkout.Session) -> Dict[str, Any]:
    """
    Process successful checkout. Update user plan based on subscription.
    """
    user_id = int(session.metadata.get("user_id", 0))
    plan = session.metadata.get("plan", "starter")
    stripe_customer_id = session.customer
    stripe_subscription_id = session.subscription

    return {
        "user_id": user_id,
        "plan": plan,
        "credits": PLAN_CREDITS.get(plan, 0),
        "stripe_customer_id": stripe_customer_id,
        "stripe_subscription_id": stripe_subscription_id,
        "status": "active",
    }


def handle_subscription_cancelled(subscription_id: str) -> Dict[str, Any]:
    """
    Handle subscription cancellation (grace period or immediate).
    """
    return {
        "subscription_id": subscription_id,
        "status": "cancelled",
    }


def handle_invoice_payment_failed(invoice: stripe.Invoice) -> Dict[str, Any]:
    """
    Handle failed payment - could downgrade user or mark as past due.
    """
    return {
        "customer_id": invoice.customer,
        "invoice_id": invoice.id,
        "status": "payment_failed",
    }


def get_subscription_details(customer_id: str) -> Optional[Dict[str, Any]]:
    """
    Fetch active subscription for a customer.
    """
    subscriptions = stripe.Subscription.list(
        customer=customer_id,
        status="active",
        limit=1,
    )
    if subscriptions.data:
        sub = subscriptions.data[0]
        return {
            "id": sub.id,
            "status": sub.status,
            "current_period_end": sub.current_period_end,
            "plan": sub.items.data[0].price.id if sub.items.data else None,
        }
    return None


def create_customer_portal_session(customer_id: str, return_url: str) -> str:
    """
    Create a billing portal session for customer to manage subscription.
    """
    session = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url=return_url,
    )
    return session.url
