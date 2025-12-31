"""
Londom Imports - Main URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "status": "online",
        "message": "London Imports API is running",
        "version": "1.0.0"
    })

def cloudinary_debug(request):
    """Diagnostic endpoint to check Cloudinary configuration"""
    import os
    from django.conf import settings
    
    cloud_storage = getattr(settings, 'CLOUDINARY_STORAGE', {})
    default_storage = getattr(settings, 'DEFAULT_FILE_STORAGE', 'Not set')
    
    return JsonResponse({
        "RENDER_ENV": os.getenv('RENDER', 'Not set'),
        "CLOUDINARY_URL_SET": bool(os.getenv('CLOUDINARY_URL')),
        "DEFAULT_FILE_STORAGE": default_storage,
        "CLOUDINARY_CLOUD_NAME": cloud_storage.get('CLOUD_NAME', 'Not set'),
        "CLOUDINARY_SECURE": cloud_storage.get('SECURE', 'Not set'),
        "DEBUG_MODE": settings.DEBUG,
    })

# Admin Customization
admin.site.site_header = "London's Imports Admin"
admin.site.site_title = "London's Imports Portal"
admin.site.index_title = "Welcome to London's Imports Management"

urlpatterns = [
    # Root
    path('', api_root, name='api-root'),
    
    # Debug endpoint (temporary)
    path('debug/cloudinary/', cloudinary_debug, name='cloudinary-debug'),

    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/auth/', include('users.urls')),
    path('api/v1/admin/', include('users.admin_urls')),  # Admin dashboard API
    path('api/v1/vendors/', include('vendors.urls')),
    path('api/v1/products/', include('products.urls')),
    path('api/v1/orders/', include('orders.urls')),
    path('api/v1/payments/', include('payments.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
