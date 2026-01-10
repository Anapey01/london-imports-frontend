---
description: Development workflow for separate frontend/backend repositories
---

# Development Workflow

## ⚠️ CRITICAL: Separate Repositories

> [!CAUTION]
> **DO NOT** push from `c:\Users\user\Desktop\Naa` to any remote!
> The `Naa` folder is a local monorepo for development convenience only.

| Repository | GitHub URL | Deploy Target |
|------------|------------|---------------|
| Frontend | `Anapey01/london-imports-frontend` | Vercel |
| Backend | `Anapey01/london-imports-backend` | Render |

---

## Frontend Development

1. Work in the frontend folder:
   ```bash
   cd c:\Users\user\Desktop\Naa\frontend
   ```

2. Run dev server:
   ```bash
   npm run dev
   ```

3. Deploy when ready (no git push needed):
   ```bash
   vercel --prod
   ```

---

## Backend Development

1. Work in the backend folder:
   ```bash
   cd c:\Users\user\Desktop\Naa\backend
   ```

2. Run dev server:
   ```bash
   python manage.py runserver
   ```

3. When ready to deploy, sync to deploy folder:
   ```bash
   xcopy /E /Y "c:\Users\user\Desktop\Naa\backend\*" "c:\Users\user\Desktop\backend-deploy\"
   ```

4. Commit and push from deploy folder:
   ```bash
   cd c:\Users\user\Desktop\backend-deploy
   git add -A
   git commit -m "your message"
   git push backend_repo master:main
   ```

---

## Key Folders

| Folder | Purpose | Git Status |
|--------|---------|------------|
| `Naa/` | Local dev monorepo | NOT connected to remote |
| `Naa/frontend/` | Frontend code | Deploy via Vercel CLI |
| `Naa/backend/` | Backend code | Copy to backend-deploy |
| `backend-deploy/` | Backend git repo | Connected to GitHub |
