# London's Imports (Frontend)

This is the e-commerce frontend for **London's Imports**, built with [Next.js 16](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/).

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- npm

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Backend API (Render)
NEXT_PUBLIC_API_URL=https://london-imports-api.onrender.com/api/v1

# Image Optimization (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dg67twduw
```

### 3. Installation

```bash
npm install
```

### 4. Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🛠 Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run start`: Start production server.
- `npm run lint`: Run ESLint checks.

## 🏗 Project Structure

- `/src/app`: App Router pages and layouts.
- `/src/components`: Reusable UI components (Buttons, Dropdowns, etc.).
- `/src/lib`: Utilities (API fetchers, image loaders, helpers).
- `/src/stores`: Zustand state management (Cart, Auth).

## 📦 Deployment

This project is deployed on **Vercel**.

- Pushes to `main` auto-deploy to production.
- **Image Optimization**: Handled via custom loader (`imageLoader.ts`) to specific Cloudinary, ensuring Vercel limits are not exceeded.
