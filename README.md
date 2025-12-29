# London's Imports Monorepo

Welcome to the **London's Imports** codebase! This is the central monorepo for the e-commerce platform, written in Django (Backend) and Next.js (Frontend).

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- Git

### 2. Setup Backend (Django)

Open a terminal and navigate to the backend:

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at [http://localhost:8000](http://localhost:8000).

### 3. Setup Frontend (Next.js)

Open a **new** terminal (keep the backend running) and navigate to the frontend:

```bash
cd frontend
# Create env file
cp .env.example .env.local

npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

- **`backend/`**: Django REST Framework API.
  - `config/`: Project settings.
  - `users/`, `products/`, `orders/`: Feature apps.
- **`frontend/`**: Next.js 13+ App Router.
  - `src/app/`: Pages and layouts.
  - `src/components/`: Reusable UI components.
  - `src/lib/`: Utilities and API clients.

## 🔑 Key Credentials (Dev)
- **Admin Login**: Access `/admin` or `/dashboard/admin` (configured locally).

For more details, check specific `README.md` files in subdirectories.
