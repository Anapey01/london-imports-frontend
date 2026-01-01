import os
import sys
import django

# Add backend to path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

try:
    django.setup()
    print("Django setup successful.")
except Exception as e:
    print(f"Django setup failed: {e}")
    sys.exit(1)

# Check Cloudinary
try:
    import cloudinary
    config = cloudinary.config()
    if config.cloud_name:
        print(f"Cloudinary Configured: Name={config.cloud_name}")
    else:
        print("Cloudinary NOT Configured (Missing Cloud Name)")
except ImportError:
    print("Cloudinary library not installed.")
except Exception as e:
    print(f"Cloudinary check error: {e}")

# Check Pillow
try:
    import PIL
    print(f"Pillow installed: Version {PIL.__version__}")
except ImportError:
    print("Pillow not installed.")
