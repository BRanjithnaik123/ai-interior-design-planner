# Installation & Setup Guide

This document describes how to set up, configure, and run the RoomsGPT Studio project locally for development and testing.

---

## 📋 Prerequisites

Before proceeding, ensure you have the following software installed:
* **Node.js** (v18.0.0 or higher)
* **Python** (v3.10 or higher)
* **npm** or **yarn** package manager
* **Git** (for version control)

---

## 🛠️ Step-by-Step Local Setup

### 1. Configure the Backend (FastAPI)

The backend is built with FastAPI and handles database management, user authentication, and coordinates the AI inference pipeline.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   * **Windows (PowerShell/CMD)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   * **macOS/Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   * Copy the template file to create your `.env` configuration:
     ```bash
     cp .env.example .env
     ```
   * Open `.env` and fill in the required values. The database will default to an SQLite file named `designai.db` inside the backend directory, so no database installation is required for local testing.

5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   * The backend API server will run on `http://localhost:8000`.
   * Open `http://localhost:8000/docs` in your browser to view the interactive Swagger API documentation.

---

### 2. Configure the Frontend (Next.js)

The frontend is a Next.js 14 application styled using vanilla CSS variables, featuring full responsive support, dynamic loading skeletons, and interactive slider components.

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   * The web application will run on `http://localhost:3000`.
   * Open `http://localhost:3000` in your web browser.

---

## ⚙️ Environment Configuration Guide

The backend `.env` configuration contains several crucial variables for configuring the system:

```env
# App Environment
ENVIRONMENT=development
SECRET_KEY=generate-a-secure-random-secret-key-for-jwt-signing
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# Database Configuration (Defaults to SQLite for local development)
DATABASE_URL=sqlite:///./designai.db

# GPT-5.2 Vision & Room Planner Service (Required)
OPENAI_API_KEY=your-openai-compatible-api-key
OPENAI_BASE_URL=https://api.openai-provider.com/v1
OPENAI_MODEL=gpt-5.2

# Swappable Image Generation Provider Layer (Optional)
OPENAI_IMAGE_API_KEY=
OPENAI_IMAGE_BASE_URL=https://api.openai.com/v1
OPENAI_IMAGE_MODEL=gpt-image-2

# Replicate ControlNet Settings (Alternative Image Generation Provider)
REPLICATE_API_TOKEN=
REPLICATE_MODEL=black-forest-labs/flux-depth-pro
```

### 🧪 Developer Sandbox Mode
If `REPLICATE_API_TOKEN` and `OPENAI_IMAGE_API_KEY` are left empty, the application automatically enters **Sandbox Mode**. In this mode:
* The system bypasses external generation billing.
* It serves highly realistic, pre-rendered renovation designs matching your selected room type from the `backend/uploads` directory.
* This allows full development, testing, and display of the frontend UX transitions and validation alerts without paying for cloud GPU runtime.

---

## 🔍 Verifying the Setup

To verify that both servers are communicating correctly:
1. Ensure the backend server is running on port 8000.
2. Check the API health check endpoint:
   `GET http://localhost:8000/api/v1/health`
   Expected response:
   ```json
   { "status": "healthy", "database": "connected" }
   ```
3. Check the AI status endpoint:
   `GET http://localhost:8000/api/v1/ai-status`
   This endpoint scans environment variables and reports active inference engines, features, and pricing structures.
