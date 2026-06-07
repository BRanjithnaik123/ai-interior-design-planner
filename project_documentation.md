# DesignAI Studio: Technical Documentation

## 1. Project Overview
**DesignAI Studio** is a premium SaaS platform that enables users to redesign any interior space instantly using artificial intelligence. 

**Main Purpose and Target Users:**
The platform targets homeowners looking for remodeling inspiration, real estate agents aiming to virtually stage properties, and professional interior designers requiring rapid visualization tools. 

**Key Business Value:**
By reducing the barrier to high-quality 3D renders from days and hundreds of dollars to seconds and pennies, DesignAI Studio democratizes interior design, significantly accelerates the design iteration process, and provides enterprise scalability.

---

## 2. Core Features
*   **AI Room Redesign:** The flagship feature; transforms uploaded photos using advanced Generative AI models.
*   **Upload Photo Functionality:** Drag-and-drop file support with immediate client-side previews.
*   **Click Photo (Camera Integration):** Native access to mobile device cameras and desktop webcams for real-time room capture.
*   **Visual Style Selection:** An interactive gallery of premium design aesthetics (Modern, Minimalist, Luxury, etc.).
*   **+ Add New Style:** An expandable modal that lazy-loads extended design libraries (Bohemian, Art Deco, Farmhouse).
*   **Before/After Comparison Slider:** An intuitive, touch-friendly UI component allowing users to slide between the original structure and the AI redesign.
*   **Enterprise Solutions:** A dedicated section highlighting white-labeling, bulk processing, and API access.
*   **Blog Section:** A curated grid of design and technology articles.
*   **Contact System:** A responsive inquiry form alongside global headquarters location mapping.
*   **Mobile App Section:** Highlights the native iOS and Android companion applications.

---

## 3. Technology Stack

### Frontend
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Vanilla CSS (`globals.css`) for maximum flexibility, supplemented by inline React styles.
*   **Animation Libraries:** `framer-motion` for complex physics-based micro-interactions, scroll reveals, and page transitions.
*   **Icon Library:** `lucide-react` for crisp, consistent, and lightweight SVG vector iconography.

### Backend / Services
*   **AI Integration:** Replicate API (utilizing ControlNet and Stable Diffusion XL pipelines).
*   **API Architecture:** Next.js Serverless Route Handlers (`app/api/`) and Python-based microservices (`ai_service.py`).
*   **File Handling:** Local browser FileReader APIs for pre-upload validation, alongside cloud blob storage for final processing.
*   **Camera APIs:** HTML5 `capture="environment"` for mobile native camera delegation, and `navigator.mediaDevices.getUserMedia` for desktop webcams.

### Development Tools
*   **Package Manager:** npm (Node Package Manager).
*   **Version Control:** Git / GitHub.
*   **Deployment:** Vercel (Frontend edge-network deployment) and Heroku/Render (Python backend services).

---

## 4. Project Architecture

### Folder Structure
```
├── frontend
│   ├── src
│   │   ├── app/                 # Next.js App Router endpoints and pages
│   │   │   ├── layout.tsx       # Global root layout and SEO metadata
│   │   │   └── page.tsx         # Central landing page orchestrator
│   │   ├── components/          # Reusable UI component library
│   │   │   ├── AIRedesign.tsx   # Core generation workflow
│   │   │   ├── Header.tsx       # Global navigation and scroll-routing
│   │   │   └── ...
│   │   └── lib/                 # Utility functions and contexts (Auth)
├── backend
│   └── app
│       └── services
│           └── ai_service.py    # Python service managing AI model prompting
```

### Component Architecture & Strategy
The application utilizes a modular, component-driven architecture. The main `page.tsx` acts purely as a layout orchestrator, delegating heavy state management and complex UI logic to specific feature components (e.g., `AIRedesign.tsx`).

---

## 5. How Each Major Feature Works

### Step-by-step Workflow
1.  **Landing:** The user arrives at the root route `/` and interacts with a high-performance Hero Section.
2.  **Navigation:** Clicking "Try for Free" smoothly scrolls the user via DOM anchor interception (`document.getElementById().scrollIntoView`) to the `AIRedesign` component.
3.  **Input Collection:** The user either drags an image onto the dropzone or activates the native device camera. The file is converted via `FileReader` to a base64 DataURL for instant preview.
4.  **Style Selection:** The user selects a desired visual style. Local state `Set<string>` tracks the active style, dynamically updating CSS borders and highlight gradients.
5.  **Generation:** Clicking generate triggers the backend API. A loading state with a simulated progress bar (`setInterval`) engages the user during the HTTP request.
6.  **Results:** The resulting images are pushed into the `BeforeAfterSlider` component, allowing interactive comparison.

---

## 6. AI Workflow

1.  **Image Upload & Pre-processing:** The client-side image is downsampled (if too large) to optimize latency, then sent to the Python `ai_service.py`.
2.  **Prompt Engineering:** The backend constructs a complex prompt matrix. The chosen style dictates the *positive prompt* (e.g., "Minimalist, monochromatic palette, clean lines, unreal engine 5 render").
3.  **Architecture Preservation:** *This is critical.* The system utilizes ControlNet (specifically depth and MLSD/line-art models) mapped against the original image. This mathematically forces the AI to keep walls, windows, doors, and camera angles completely identical.
4.  **Generation:** The generative model replaces the textures, furniture, and lighting according to the prompt while adhering to the ControlNet structural maps.
5.  **Delivery:** The finalized photorealistic output is returned to the Next.js client.

---

## 7. UI/UX Design Principles

*   **Responsive Approach:** Built mobile-first utilizing CSS Grid, Flexbox, and `clamp()` typography functions to ensure layouts fluidly adapt from 320px smartphones to 4K desktop monitors.
*   **Accessibility:** Semantic HTML5 sections (`<nav>`, `<header>`, `<main>`), ARIA labels for icon buttons, and color contrast adherence.
*   **Micro-interactions:** Extensive use of `framer-motion` for subtle hover scaling (`scale: 1.05`), fade-up animations on scroll, and seamless modal transitions to convey a premium "SaaS" feel.

---

## 8. Performance Optimizations

*   **Image Optimization:** Unsplash images append `?w=800&q=80` query parameters to drastically reduce payload sizes. Secondary and below-the-fold images utilize HTML5 `loading="lazy"`.
*   **Code Splitting:** Next.js App Router natively implements automatic route-level code splitting.
*   **SEO Enhancements:** `layout.tsx` is injected with comprehensive `metadata`, OpenGraph tags, and Twitter Cards to ensure rich link previews on social platforms. Font `display: swap` ensures no text blocking during load.

---

## 9. Security and Best Practices

*   **Environment Variables:** Sensitive API keys (Replicate, AWS) are stored securely in `.env.local` and never exposed to the client bundle (`NEXT_PUBLIC_` prefixes are strictly avoided for secrets).
*   **Data Privacy:** Uploaded photos are processed ephemerally in memory or utilizing short-lived signed URLs, ensuring user interior photos are not permanently stored without explicit consent.

---

## 10. Deployment Guide

### Vercel Deployment (Frontend)
1.  Push the repository to GitHub.
2.  Connect the repository in the Vercel dashboard.
3.  Set the Framework Preset to `Next.js`.
4.  Configure Environment Variables in the Vercel UI.
5.  Deploy. Vercel will automatically run `npm run build` and distribute the application globally across its edge network.

### Backend Deployment
1.  Package the Python application using Docker or standard `requirements.txt`.
2.  Deploy to a scalable platform like Render, Heroku, or AWS App Runner.
3.  Update the frontend environment variables to point to the live backend URL.

---

## 11. Future Enhancements

*   **3D Walkthroughs:** Implementing Three.js/WebGL to extrapolate a 3D navigable environment from the 2D generated redesign.
*   **E-Commerce Integration:** Utilizing computer vision to identify generated furniture and provide direct purchase links (affiliate revenue stream).
*   **Scalability:** Migrating image storage to a globally distributed CDN bucket and implementing WebSocket connections for real-time AI generation progress tracking.
