"""
Londom Imports - Django Settings
Pre-order first platform for Ghana
"""
import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY
# Critical: Raise error in production if SECRET_KEY is missing
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY and os.getenv('RENDER'):
    raise ValueError("SECRET_KEY environment variable is missing in Production!")
if not SECRET_KEY:
    SECRET_KEY = 'dev-secret-key-change-in-production'

# Default to False for security
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1,.onrender.com').split(',')
# CRITICAL: Force add the Render domain even if ALLOWED_HOSTS env var is set to something else
if 'london-imports-api.onrender.com' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append('london-imports-api.onrender.com')

# Render / Production Security Settings
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

if not DEBUG:
    # Strict Security Headers for Production
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    
    # HSTS (HTTP Strict Transport Security)
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'cloudinary_storage',
    'cloudinary',
    
    # Local apps
    'users',
    'vendors',
    'products',
    'orders',
    'payments',
    'deliveries',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database - Use DATABASE_URL for production (Render/Supabase), fallback to SQLite for development
import dj_database_url

DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL:
    # Production: PostgreSQL via DATABASE_URL
    # CRITICAL: Set conn_max_age to 0 to prevent "SSL connection has been closed unexpectedly" errros
    # Render/PaaS often kill idle connections silently. forcing fresh connections is safer.
    DATABASES = {
        'default': dj_database_url.config(default=DATABASE_URL, conn_max_age=0, ssl_require=True)
    }
else:
    # Development: SQLite
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Custom User Model
AUTH_USER_MODEL = 'users.User'

# Internationalization - Ghana time
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Accra'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# Media files - Use Cloudinary in production, local storage in development
from django.core.exceptions import ImproperlyConfigured
import cloudinary

if os.getenv('RENDER') or os.getenv('CLOUDINARY_URL'):
    # Production (Render) - STRICT ENFORCEMENT or Local with Cloud Keys
    # Production (Render) - STRICT ENFORCEMENT or Local with Cloud Keys
    has_cloudinary_url = os.getenv('CLOUDINARY_URL')
    has_individual_keys = (
        os.getenv('CLOUDINARY_CLOUD_NAME') and 
        os.getenv('CLOUDINARY_API_KEY') and 
        os.getenv('CLOUDINARY_API_SECRET')
    )

    if not has_cloudinary_url and not has_individual_keys:
        if os.getenv('RENDER'):
            raise ImproperlyConfigured(
                "CRITICAL SECURITY ERROR: Cloudinary configuration is missing in Production! "
                "Please add CLOUDINARY_URL or (CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET) to Render Environment Variables."
            )
    
    # Auto-configure from URL if individual keys are missing
    if has_cloudinary_url:
        # This parses the URL and sets the config globally
        cloudinary.config() 
    
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
    
    # explicitly pull from cloudinary config if env vars are missing
    config = cloudinary.config()
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME') or config.cloud_name,
        'API_KEY': os.getenv('CLOUDINARY_API_KEY') or config.api_key,
        'API_SECRET': os.getenv('CLOUDINARY_API_SECRET') or config.api_secret,
        'SECURE': True,
    }
    MEDIA_URL = '/media/'
else:
    # Local Development default
    MEDIA_URL = 'media/'
    MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# Simple JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

# CORS Settings - Allow frontend
# CORS Settings - Robust Regex for Vercel + Custom Domain
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',')
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://london-import-frontend.*\.vercel\.app$",
    r"^https://(www\.)?londonsimports\.com$",  # Custom domain
]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = os.getenv(
    'CSRF_TRUSTED_ORIGINS', 
    'http://localhost:3000,https://london-imports-api.onrender.com'
).split(',')

# CRITICAL: Force add the Render domain to Trusted Origins
# This fixes "CSRF verification failed" errors when uploading files in Admin
if 'https://london-imports-api.onrender.com' not in CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS.append('https://london-imports-api.onrender.com')

# Also add the frontend Vercel app to be safe for API calls
if 'https://london-import-frontend.vercel.app' not in CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS.append('https://london-import-frontend.vercel.app')

# Add custom domain to CSRF trusted origins
if 'https://londonsimports.com' not in CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS.append('https://londonsimports.com')
if 'https://www.londonsimports.com' not in CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS.append('https://www.londonsimports.com')


# Celery Settings
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Africa/Accra'

# Redis Cache
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': os.getenv('REDIS_URL', 'redis://localhost:6379/1'),
    }
}

# Paystack Settings
PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY', '')
PAYSTACK_PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY', '')

# Notification Settings
SMS_PROVIDER = os.getenv('SMS_PROVIDER', 'hubtel')  # hubtel, termii, africastalking
SMS_API_KEY = os.getenv('SMS_API_KEY', '')
SMS_SENDER_ID = os.getenv('SMS_SENDER_ID', 'LondomImports')

# Email Settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@londomimports.com')

# Platform Settings
PLATFORM_NAME = 'Londom Imports'
PLATFORM_FEE_PERCENTAGE = 5.0  # Platform takes 5% of each order
AUTO_CONFIRM_DELIVERY_HOURS = 72  # Auto-confirm delivery after 72 hours
