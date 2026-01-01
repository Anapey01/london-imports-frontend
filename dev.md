# Project Development & Deployment Guide

## 1. Project Structure (Monorepo)
The project is organized as a **Monorepo** containing both the Frontend (Next.js) and Backend (Django) in a single repository.

```
/ (Repo Root)
├── frontend/       # Next.js Application
│   ├── package.json
│   ├── src/
│   └── ...
├── backend/        # Django Application
│   ├── manage.py
│   ├── config/
│   ├── requirements.txt
│   └── ...
└── dev.md          # This Guide
```

## 2. Deployment Strategies

### A. Frontend (Vercel)
*   **Repo Connection**: Connect the repository (`london-imports-frontend`) to Vercel.
*   **Root Directory**: Set **Root Directory** to `frontend` in Project Settings.
*   **Build Command**: `next build` (or `npm run build`).
*   **Install Command**: `npm install`.
*   **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: `https://london-imports-api.onrender.com/api/v1`

### B. Backend (Render)
*   **Repo Connection**: Connect the repository to Render.
*   **Root Directory**: Set **Root Directory** to `backend` in Service Settings.
*   **Build Command**: `./build.sh` (Ensure this script exists in `backend/` and runs migrations).
*   **Start Command**: `gunicorn config.wsgi:application`.
*   **Environment Variables**:
    *   `SECRET_KEY`, `DEBUG`, `DATABASE_URL`, `CLOUDINARY_URL`, etc.

## 3. Local Development
*   **Frontend**: `cd frontend` -> `npm run dev`.
*   **Backend**: `cd backend` -> `python manage.py runserver`.

## 4. Git Workflow
*   **Branch**: `main` acts as the production branch.
*   **Push**: When you push to `main`, both Vercel and Render will trigger.
    *   Vercel detects changes in `frontend/**` and deploys.
    *   Render detects changes in `backend/**` and deploys.

## 5. Troubleshooting
*   **"Login Failed"**: Check `frontend/src/lib/api.ts` ensures `API_BASE_URL` matches the Render URL.
*   **"Product Not Found"**: Check Vercel logs for SSR errors or Backend logs for API errors.
*   **CORS Issues**: Ensure Backend `settings.py` allows the Vercel domain.

---
**Note**: Do NOT use `git push --force` on the root unless necessary. Always pull the latest changes before pushing.
