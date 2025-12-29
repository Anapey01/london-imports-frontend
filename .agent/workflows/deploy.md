---
description: Deploy frontend to Vercel production
---

# Deploy Frontend to Vercel

Use this workflow when you need to deploy frontend changes to Vercel.

## Prerequisites
- Ensure you have the Vercel CLI installed (`vercel --version`)
- Ensure you're linked to the correct project

## Steps

1. Navigate to the frontend-deploy worktree (if it exists) or create it:
   ```powershell
   # If worktree doesn't exist:
   git worktree add ../frontend-deploy split-frontend
   
   # If it exists, update it:
   cd ../frontend-deploy && git pull origin split-frontend
   ```

// turbo
2. Install dependencies in the worktree:
   ```powershell
   cd ../frontend-deploy && npm install
   ```

// turbo  
3. Test the build locally (optional but recommended):
   ```powershell
   cd ../frontend-deploy && npm run build
   ```

// turbo
4. Deploy to Vercel production:
   ```powershell
   cd ../frontend-deploy && vercel --prod
   ```

## Important Notes

- **DO NOT** push `feature/next-sprint` or `master` to `frontend_repo/main` - these branches have a broken frontend submodule
- **ALWAYS** use the `split-frontend` branch or the `frontend-deploy` worktree for Vercel deployments
- The `frontend-deploy` worktree is located at `c:\Users\user\Desktop\frontend-deploy`

## Syncing Frontend Changes

If you make frontend changes on `feature/next-sprint`, you need to cherry-pick or recreate them on `split-frontend`:

1. Checkout split-frontend: `git checkout split-frontend`
2. Make your frontend changes there
3. Commit and push: `git push frontend_repo split-frontend:main`
4. Or use the worktree and deploy via CLI as above
