---
description: Deploy frontend to Vercel and backend to Render
---

# Deployment Workflow

## ⚠️ CRITICAL: Separate Repositories

This project uses **TWO SEPARATE GitHub repositories**:

| Repository | URL | Deployment |
|------------|-----|------------|
| **Frontend** | `github.com/Anapey01/london-imports-frontend` | Vercel |
| **Backend** | `github.com/Anapey01/london-imports-backend` | Render |

> [!CAUTION]
> The local `Naa` folder is a **monorepo for development only**. It is NOT connected to a single GitHub repo. Never push the entire `Naa` folder to either repo - this causes code mixing!

---

## Frontend Deployment (Vercel)

// turbo-all

1. Navigate to frontend folder:
   ```bash
   cd c:\Users\user\Desktop\Naa\frontend
   ```

2. Deploy via Vercel CLI:
   ```bash
   vercel --prod
   ```

That's it! Vercel handles the build automatically.

---

## Backend Deployment (Render)

1. Copy backend changes to the deploy folder:
   ```bash
   xcopy /E /Y "c:\Users\user\Desktop\Naa\backend\*" "c:\Users\user\Desktop\backend-deploy\"
   ```

2. Navigate to backend-deploy:
   ```bash
   cd c:\Users\user\Desktop\backend-deploy
   ```

3. Commit and push:
   ```bash
   git add -A
   git commit -m "your commit message"
   git push backend_repo master:main
   ```

Render will auto-detect the push and deploy.

---

## Folder Structure

| Path | Purpose |
|------|---------|
| `c:\Users\user\Desktop\Naa` | Local development monorepo |
| `c:\Users\user\Desktop\Naa\frontend` | Frontend source code |
| `c:\Users\user\Desktop\Naa\backend` | Backend source code |
| `c:\Users\user\Desktop\backend-deploy` | Backend deploy folder (connected to GitHub) |

---

## Remotes Configuration

In `backend-deploy`, ensure this remote exists:
```bash
git remote add backend_repo https://github.com/Anapey01/london-imports-backend.git
```

In `Naa/frontend`, the Vercel CLI handles deployment directly (no git push needed).
