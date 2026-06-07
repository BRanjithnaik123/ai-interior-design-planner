# RoomsGPT Studio: AI-Powered Interior Design & Space Planner

RoomsGPT Studio is an enterprise-grade AI interior design and space planning application. Built using a modern full-stack architecture with a **FastAPI** backend and a **Next.js 14** frontend, the platform provides automated structural analysis, photorealistic room renovations, and comprehensive interior design blueprints.

Unlike standard text-to-image models that generate random rooms, RoomsGPT Studio features a strict **Structure Lock Validation Engine** that preserves walls, windows, doors, perspective, and architectural boundaries during generation.

---

## 🚀 Key Features

* **Structure-Preserving Renovation**: Preserves room dimensions, perspective, and architectural lines using ControlNet (Canny/Depth) and GPT-5 Vision constraints.
* **GPT-5.2 Vision Space Analysis**: Scans input room photographs to identify room geometry, vanishing points, wall positions, built-in features, and lighting conditions.
* **Multi-Tiered Validation Engine**: Checks generated images against the original room structures, rating the result on three tiers:
  * **Excellent Match (90–100%)**: Seamless structural preservation.
  * **Acceptable Match (80–89%)**: Acceptable minor shifts with core structure locked.
  * **Failed Match (Below 80%)**: Blocked due to altered walls, geometry shifts, or camera angle changes.
* **Automated Pipeline Retry**: Automatically retries the image generation process with stricter control strengths and preservation instructions if the initial similarity score is below 80%.
* **AI Design Planner & PDF Export**: Generates comprehensive space planning reports including premium color palettes (with hex codes), layout strategies, and lighting guides, exportable directly to PDF.
* **Production-Ready SaaS Features**: Integrated credit system, responsive design, interactive dashboards, dynamic before-and-after sliders, and a shared public gallery.

---

## 📂 Project Organization

```
├── backend/                     # FastAPI Python Web Service
│   ├── app/
│   │   ├── main.py              # Application entrypoint & middleware
│   │   ├── database.py          # SQLAlchemy engine & session configuration
│   │   ├── config.py            # Environment settings & validation
│   │   ├── models/              # SQLAlchemy Database Models (User, Design, Project)
│   │   ├── schemas/             # Pydantic validation schemas
│   │   ├── routers/             # API Router endpoints (Auth, Designs, Projects)
│   │   └── services/            # AI analysis, OpenAI & image generation layers
│   └── requirements.txt         # Backend Python dependencies
│
├── frontend/                    # Next.js 14 React Web Application
│   ├── src/app/                 # Next.js App Router (Dashboard, Studio, Auth)
│   ├── src/components/          # Modular component library (Sliders, Uploaders)
│   ├── src/lib/                 # API client, context providers, and utility code
│   └── tailwind.config.ts       # Tailwind CSS configuration
```

---

## 📖 Documentation & Setup

For detailed instructions on running, configuring, and understanding the platform's codebase, please refer to the following files:

1. **[Installation & Local Setup Guide](file:///c:/Users/HP%20745%20G6/Desktop/AI/INSTALLATION.md)**: Details setup commands, environment configurations, and local startup scripts.
2. **[System Architecture Guide](file:///c:/Users/HP%20745%20G6/Desktop/AI/ARCHITECTURE.md)**: Explains the AI pipelines, the structure validation logic, database layouts, and API flow.

---

## 🛠️ Quick Local Start

1. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # venv\Scripts\activate on Windows
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Open `http://localhost:3000` to interact with the studio. Out of the box, the system runs in **AI Sandbox mode**, using high-fidelity pre-rendered designs to preview capabilities without incurring API costs. Add actual keys to `backend/.env` to connect live.
