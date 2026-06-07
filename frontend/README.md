# DesignAI Studio

AI-powered home renovation platform. Upload a photo, choose a design style, and visualize your renovation with photorealistic AI renders in seconds.

## Features

- **Before & After Slider** — Interactive drag comparison of original vs. renovated rooms
- **AI Room Redesign** — Drag-and-drop image upload with 7 design style options
- **Room Categories** — Living Room, Bedroom, Kitchen, Bathroom, Dining Room galleries
- **AI Toolkit** — 10+ specialized tools (Virtual Staging, Upscaling, Paint, Sketch-to-Render)
- **Gallery & Filters** — Search, filter by room type, style, and color palette
- **Project History** — Dashboard with thumbnails, status, download/share/delete
- **Pricing** — 3-tier pricing cards with FAQ accordion
- **Video Showcase** — Embedded renovation walkthrough video
- **Testimonials** — User reviews with star ratings
- **Full Responsive** — Desktop, tablet, and mobile optimized
- **Accessibility** — Skip-to-content, ARIA labels, focus-visible, keyboard navigation
- **SEO** — Open Graph, Twitter Cards, structured metadata, semantic HTML

## Tech Stack

| Layer        | Technology                   |
|-------------|------------------------------|
| Framework   | Next.js 16 (App Router)      |
| Language    | TypeScript, React 19         |
| Styling     | Tailwind CSS v4 + CSS vars   |
| Animations  | Framer Motion                |
| Icons       | Lucide React                 |
| Auth        | Custom AuthContext + JWT      |
| Backend     | FastAPI (Python)             |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Create `.env.local` in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Project Structure

```
frontend/src/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Homepage assembling all sections
│   └── globals.css         # Design system & CSS tokens
├── components/
│   ├── Header.tsx          # Glassmorphism nav + mobile drawer
│   ├── HeroSection.tsx     # Hero with animated CTA + slider
│   ├── BeforeAfterSlider.tsx  # Draggable before/after comparison
│   ├── RoomCategories.tsx  # Interactive cards + gallery modal
│   ├── AIRedesign.tsx      # Upload + style select + AI results
│   ├── AIToolkit.tsx       # Tool grid with PRO badges
│   ├── VideoShowcase.tsx   # Video embed + feature highlights
│   ├── GalleryFilter.tsx   # Search + multi-filter gallery
│   ├── ProjectHistory.tsx  # Project dashboard + context menus
│   ├── Testimonials.tsx    # Review cards with ratings
│   ├── PricingAndFAQ.tsx   # Pricing tiers + FAQ accordion
│   └── Footer.tsx          # Branded footer with links
└── lib/
    ├── api.ts              # API client with auth headers
    └── auth-context.tsx    # Auth state management
```

## Design System

CSS variables defined in `globals.css`:

- **Colors**: `--bg`, `--text`, `--primary`, `--accent`, `--border`
- **Gradients**: `--gradient-brand`, `--gradient-accent`
- **Shadows**: `--shadow-sm` through `--shadow-xl`
- **Radii**: `--radius`, `--radius-lg`, `--radius-xl`
- **Utilities**: `.card`, `.btn-primary`, `.btn-secondary`, `.badge`, `.tag`, `.gradient-text`

## License

Proprietary. All rights reserved.
