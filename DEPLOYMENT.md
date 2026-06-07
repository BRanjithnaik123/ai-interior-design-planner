# DesignAI Production Deployment Guide

## Prerequisites

- Docker & Docker Compose (recommended for easiest setup)
- OR individual service setup (PostgreSQL, Redis, etc.)
- Stripe account (for payments)
- Replicate account (for AI generation)
- Domain name (for production)

---

## Option 1: Docker Compose (Easiest)

### 1. Clone and Setup

```bash
cd /path/to/designai
```

### 2. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# Production Environment
ENVIRONMENT=production

# Database (if not using Docker's internal PostgreSQL)
# DATABASE_URL=postgresql://user:pass@host:5432/designai

# JWT Secret (generate a strong random key)
SECRET_KEY=your-super-secure-secret-key-at-least-32-chars

# AI Service
REPLICATE_API_TOKEN=your_replicate_token_here

# Stripe Keys (get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PROFESSIONAL=price_...
STRIPE_PRICE_BUSINESS=price_...

# Frontend URL (your domain)
FRONTEND_URL=https://yourdomain.com
```

For development with local SQLite, keep `DATABASE_URL=sqlite:///./designai.db`.

### 3. Start with Docker Compose

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on http://localhost:8000
- Frontend on http://localhost:3000

### 4. Run Database Migrations

```bash
docker-compose exec backend alembic upgrade head
```

### 5. Access Your Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs (dev only)
- Health Check: http://localhost:8000/health

---

## Option 2: Manual Setup (Individual Services)

### 1. PostgreSQL Database

#### Using Supabase (Recommended)
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → Database → Connection String
4. Copy the "PostgreSQL" connection string
5. Update `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

#### Using Self-Hosted/DigitalOcean/Render
Create a PostgreSQL database and get the connection URL.

### 2. Redis (for rate limiting & caching)

#### Install locally:
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis

# Windows (using WSL2 recommended)
```

Or use a managed service (Redis Labs, Upstash).

Update `backend/.env` if using external Redis:
```env
REDIS_URL=redis://localhost:6379
```

### 3. Backend API

#### Install Python dependencies:
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

#### Run database migrations:
```bash
alembic upgrade head
```

#### Start the backend:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at http://localhost:8000

#### Production backend startup (without reload):
```bash
gunicorn -k uvicorn.workers.UvicornWorker app.main:app -b 0.0.0.0:8000
```

### 4. Frontend (Next.js)

#### Install dependencies:
```bash
cd frontend
npm install
```

#### Set environment variables:
```bash
cp frontend/.env.local.example frontend/.env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_yyy
NEXT_PUBLIC_STRIPE_PRICE_BUSINESS=price_zzz
```

#### Start development server:
```bash
npm run dev
```

Frontend will be at http://localhost:3000

#### Build for production:
```bash
npm run build
npm start
```

---

## Setting Up Stripe

### 1. Create Stripe Account
- Sign up at https://stripe.com
- Complete verification

### 2. Create Products & Prices

In Stripe Dashboard → Products:

#### Create "Starter" Product:
- Product name: Starter
- Pricing: $13/month (recurring)
- Copy the Price ID (looks like `price_xxx`)

#### Create "Professional" Product:
- Product name: Professional
- Pricing: $24/month
- Copy the Price ID

#### Create "Business" Product:
- Product name: Business
- Pricing: $99/month
- Copy the Price ID

### 3. Configure Webhook

#### Create a webhook endpoint:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/v1/payments/stripe-webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
   - `invoice.payment_failed`

4. Copy the Webhook Signing Secret (looks like `whsec_xxx`)

5. Add to `backend/.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

#### Local testing with Stripe CLI:
```bash
# Install Stripe CLI
# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:8000/api/v1/payments/stripe-webhook
```

The CLI will output a test webhook secret to use in `.env`.

### 4. Stripe Billing Portal
The app automatically creates billing portal sessions for customers to manage their subscriptions.

---

## Setting Up Replicate AI

### 1. Create Replicate Account
- Sign up at https://replicate.com
- Get your API token from Account → API Tokens

### 2. Add to `.env`:
```env
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxx
```

### 3. Model Used
- Model: `jagilley/controlnet-hough:854e87270c1a01e072b21b8b80b7410eb820a6f44f06ddb824a7322bea052062`
- This is a ControlNet model for interior design generation

---

## Production Deployment

### Deploy Backend to Render

1. Create account at https://render.com
2. New Web Service
3. Connect your GitHub repo
4. Settings:
   - Name: designai-backend
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt && alembic upgrade head`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Plan: Start with Starter ($7/month)

5. Environment Variables (in Render dashboard):
   ```
   ENVIRONMENT=production
   DATABASE_URL=postgresql://...
   SECRET_KEY=random_secure_string_32+_chars
   REPLICATE_API_TOKEN=...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_STARTER=price_...
   STRIPE_PRICE_PROFESSIONAL=price_...
   STRIPE_PRICE_BUSINESS=price_...
   FRONTEND_URL=https://yourdomain.com
   ```

6. Deploy

### Deploy Backend to Railway

1. Create account at https://railway.app
2. New Project → Deploy from GitHub repo
3. Set root directory to `backend`
4. Add plugins:
   - PostgreSQL database
   - Redis (optional)
5. Configure environment variables
6. Deploy

### Deploy Backend to AWS EC2

1. Launch Ubuntu 22.04 EC2 instance
2. SSH into instance:

```bash
# Install dependencies
sudo apt update
sudo apt install -y python3-pip python3-venv postgresql redis-server nginx

# Clone repo
git clone https://github.com/yourusername/designai.git
cd designai/backend

# Setup virtualenv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup PostgreSQL
sudo -u postgres psql
CREATE DATABASE designai;
CREATE USER designai WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE designai TO designai;
\q

# Update .env with PostgreSQL URL
export DATABASE_URL=postgresql://designai:yourpassword@localhost:5432/designai

# Run migrations
alembic upgrade head

# Create systemd service for backend
sudo nano /etc/systemd/system/designai-backend.service
```

Systemd service file:
```ini
[Unit]
Description=DesignAI Backend
After=network.target postgresql.service

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/designai/backend
Environment="PATH=/home/ubuntu/designai/backend/venv/bin"
ExecStart=/home/ubuntu/designai/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl start designai-backend
sudo systemctl enable designai-backend

# Setup Nginx
sudo nano /etc/nginx/sites-available/designai
```

Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /uploads {
        alias /home/ubuntu/designai/backend/uploads;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/designai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Certbot
sudo certbot --nginx -d yourdomain.com
```

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. New Project → Import GitHub repo
4. Settings:
   - Root Directory: `frontend`
   - Framework Preset: Next.js
5. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://yourdomain.com/api/v1
   NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_...
   NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_...
   NEXT_PUBLIC_STRIPE_PRICE_BUSINESS=price_...
   ```
6. Deploy

Vercel automatically provides SSL certificate.

---

## Post-Deployment Checklist

### Stripe Webhook Configuration

Set webhook endpoint to your production URL:
```
https://yourdomain.com/api/v1/payments/stripe-webhook
```

Update webhook secret in backend environment variables.

### Database Migrations

If you add new features, run:
```bash
alembic upgrade head
```

### Monitor Logs

- Backend: Check service logs (systemctl/journalctl or provider dashboard)
- Frontend: Vercel/Render logs
- Stripe: Dashboard → Developers → Logs

### Test Payment Flow

1. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

2. After checkout, verify:
   - User credits added
   - User plan updated in database
   - Subscription active in Stripe dashboard

3. Test billing portal cancellation

---

## Environment Variables Reference

### Required for Backend
| Variable | Description | Example |
|----------|-------------|---------|
| `ENVIRONMENT` | `development` or `production` | `production` |
| `SECRET_KEY` | JWT signing secret (32+ chars) | random string |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `REPLICATE_API_TOKEN` | Replicate AI API key | `r8_xxx` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_xxx` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_xxx` |
| `STRIPE_PRICE_STARTER` | Stripe price ID for Starter | `price_xxx` |
| `STRIPE_PRICE_PROFESSIONAL` | Stripe price ID for Pro | `price_yyy` |
| `STRIPE_PRICE_BUSINESS` | Stripe price ID for Business | `price_zzz` |
| `FRONTEND_URL` | Your frontend domain | `https://app.com` |

### Optional
| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server for emails |
| `SMTP_PORT` | SMTP port |
| `SMTP_USER` | Email username |
| `SMTP_PASSWORD` | Email password |
| `EMAIL_FROM` | Sender email address |

### Required for Frontend
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.yourdomain.com` |
| `NEXT_PUBLIC_STRIPE_PRICE_STARTER` | Same as backend |
| `NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL` | Same as backend |
| `NEXT_PUBLIC_STRIPE_PRICE_BUSINESS` | Same as backend |

---

## Troubleshooting

### Database Connection Issues
- Check PostgreSQL is running
- Verify connection string format
- Ensure user has proper permissions
- Check firewall/security groups

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend domain
- In production, CORS middleware accepts one additional origin beyond localhost:3000

### Stripe Webhook Failures
- Verify webhook URL is publicly accessible
- Check webhook secret matches
- View webhook delivery logs in Stripe dashboard
- For local testing, use `stripe listen` CLI

### 502/504 Errors
- Backend may have crashed; check logs
- Verify port bindings (should be 0.0.0.0:8000)
- Check Docker container status

### AI Generation Failing
- Verify Replicate token is valid
- Check Replicate account has credits
- Check model is available in your account

---

## Scaling Considerations

### Backend
- Use a process manager (Gunicorn with multiple workers)
- Add Redis for session/cache layer
- Implement Celery for async AI tasks (currently uses FastAPI BackgroundTasks)
- Add Prometheus metrics endpoint
- Enable structured logging

### Database
- Add connection pooling (pgbouncer)
- Create indexes on frequently queried columns
- Regular backups (automated snapshots)
- Read replicas for heavy read loads

### Frontend
- Enable Next.js Image Optimization
- Configure CDN for static assets
- Implement ISR/SSG for pages
- Add error monitoring (Sentry)

---

## Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Use HTTPS in production
- [ ] Enable HSTS headers
- [ ] Keep dependencies updated
- [ ] Store secrets in environment variables only
- [ ] Enable database SSL if remote
- [ ] Set up firewall rules (only 80/443 open to world)
- [ ] Use strong database passwords
- [ ] Enable Stripe webhook signature verification
- [ ] Rate limit all endpoints
- [ ] Add login attempt monitoring
- [ ] Regular backups
- [ ] Monitor logs for suspicious activity

---

## Support

For issues, check:
1. Backend logs: `docker-compose logs backend` or `journalctl -u designai-backend`
2. Frontend logs: Vercel/Render dashboard
3. Database logs
4. Browser console for frontend errors
5. API console at http://localhost:8000/docs (dev)
