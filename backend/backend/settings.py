import os
from pathlib import Path
from datetime import timedelta
import dj_database_url
from corsheaders.defaults import default_headers

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

AUTH_USER_MODEL = 'users.User'

# --------------------------------------------------
# 1. Environment & Security Settings
# --------------------------------------------------
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-1mufcp7kpc(xbu_$b5)$1y58sk4*93uf5@*&1mb077gnwee8h^')

DEBUG = os.environ.get('DEBUG', 'False').lower() in ('true', '1')

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.onrender.com', '*']
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)


# --------------------------------------------------
# 2. CORS & CSRF Settings (Fixed for Vercel)
# --------------------------------------------------
FRONTEND_URL = os.environ.get('FRONTEND_URL')

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_ALL_ORIGINS = True 

if FRONTEND_URL:
    # rstrip('/') prevents crashes caused by trailing slashes
    CORS_ALLOWED_ORIGINS.append(FRONTEND_URL.rstrip('/'))

# Allows all Vercel production and branch/preview deployment URLs
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.vercel\.app$",
]

CORS_ALLOW_CREDENTIALS = True

# Allowed HTTP headers for JWT and Auth
CORS_ALLOW_HEADERS = list(default_headers) + [
    'authorization',
    'content-type',
    'accept',
    'origin',
    'x-requested-with',
]

# CSRF Trusted Origins
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://*.vercel.app",
]
if RENDER_EXTERNAL_HOSTNAME:
    CSRF_TRUSTED_ORIGINS.append(f"https://{RENDER_EXTERNAL_HOSTNAME}")
if FRONTEND_URL:
    CSRF_TRUSTED_ORIGINS.append(FRONTEND_URL.rstrip('/'))


# --------------------------------------------------
# 3. Installed Apps
# --------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'users',         
    'products',
    'inventory',
    'customers',
    'django_filters',
    'sales',
    'purchase_orders',
    'reports',
    'dashboard',
    'core',
    'notifications.apps.NotificationsConfig',
    'import_export',
]


# --------------------------------------------------
# 4. Middleware
# --------------------------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be at the very top
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'backend.wsgi.application'


# --------------------------------------------------
# 5. Database Configuration
# --------------------------------------------------
DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600
    )
}


# --------------------------------------------------
# 6. Password Validation & Localization
# --------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# --------------------------------------------------
# 7. Static & Media Files
# --------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

MEDIA_URL = '/media/' 
MEDIA_ROOT = BASE_DIR / 'media'


# --------------------------------------------------
# 8. Django REST Framework & JWT Configuration
# --------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'users.permissions.RoleBasedPermission', 
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}