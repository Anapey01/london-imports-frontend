---
description: Development workflow for split branch organization
---

# Development Workflow

This project uses a split-branch organization for frontend and backend code.

## Branch Structure

| Branch | Purpose | Deployment |
|--------|---------|------------|
| `split-frontend` | Frontend code | Vercel |
| `split-backend` | Backend code | Render |
| `feature/next-sprint` | Backend development | - |

## Frontend Development

// turbo-all

1. Navigate to frontend worktree:
   ```powershell
   cd c:\Users\user\Desktop\frontend-deploy
   ```

2. Make your changes to the frontend code

3. Test locally:
   ```powershell
   npm run dev
   ```

4. Commit and push:
   ```powershell
   git add -A && git commit -m "your message" && git push frontend_repo split-frontend:main
   ```

## Backend Development

1. Work in the main repo:
   ```powershell
   cd c:\Users\user\Desktop\Naa\backend
   ```

2. Make your changes to the backend code

3. Test locally:
   ```powershell
   python manage.py runserver
   ```

4. Sync to split-backend and push:
   ```powershell
   cd ..\backend-deploy
   xcopy /E /Y ..\Naa\backend\* .
   git add -A && git commit -m "your message" && git push backend_repo split-backend:main
   ```

## Quick Reference

- **Frontend worktree**: `c:\Users\user\Desktop\frontend-deploy`
- **Backend worktree**: `c:\Users\user\Desktop\backend-deploy`
- **Main repo**: `c:\Users\user\Desktop\Naa`
