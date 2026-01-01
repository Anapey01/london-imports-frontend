# London Imports - Production Infrastructure Guide

## ✅ Critical Environment Variables (Render)

These variables **MUST** be set correctly for the site to function:

| Variable | Format | Example |
|----------|--------|---------|
| `SECRET_KEY` | Random 50+ char string | `your-super-secret-key-here` |
| `DATABASE_URL` | `postgres://user:pass@host:port/db?sslmode=require` | `postgres://neondb_owner:xxx@ep-xxx.neon.tech:5432/neondb?sslmode=require` |
| `CLOUDINARY_URL` | `cloudinary://api_key:api_secret@cloud_name` | `cloudinary://412229324751685:xxx@dg67twduw` |

### Database (PostgreSQL - Neon)
- **Never use SQLite in production** - data gets wiped on every deploy
- Current config: Uses `dj-database-url` to parse `DATABASE_URL`
- Fallback: SQLite only for local development (when `DATABASE_URL` is not set)

### Images (Cloudinary)
- **Uses `CloudinaryField`** - uploads directly to Cloudinary API
- Images persist across all deployments
- Folder structure: `products/` for product images
- Secure HTTPS URLs always returned

## 🛡️ What Was Fixed

### 1. Database Connection
- Changed from manual parsing (`DB_HOST`, `DB_USER`, etc.) to `dj_database_url.config()`
- Now correctly reads the `DATABASE_URL` connection string

### 2. Image Storage
- Changed from `ImageField` (Django) to `CloudinaryField` (Cloudinary)
- Uploads now go directly to Cloudinary, not relying on storage backend

### 3. Security Headers
- HSTS enabled with 1-year max-age
- Secure cookies, SSL redirect in production
- SECRET_KEY enforced in production

## 🔒 Deploy Checklist

Before any production deploy:
1. ✅ `SECRET_KEY` is set (not the dev fallback)
2. ✅ `DATABASE_URL` is a valid postgres:// URL
3. ✅ `CLOUDINARY_URL` is `cloudinary://key:secret@name` format
4. ✅ No hardcoded secrets in code
5. ✅ `DEBUG=False` in production

## 📁 Key Files

| File | Purpose |
|------|---------|
| `config/settings.py` | All environment config |
| `products/models.py` | CloudinaryField for images |
| `products/serializers.py` | Image URL serialization |

## 🚨 Common Issues

**Images not showing after deploy?**
→ Check `CLOUDINARY_URL` format - must be `cloudinary://...`

**Data disappeared after deploy?**
→ Check `DATABASE_URL` - must be valid postgres:// URL

**Site won't start?**
→ Check `SECRET_KEY` is set on Render

---
*Last updated: December 31, 2025*
