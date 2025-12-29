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

urlpatterns = [
    # Root
    path('', api_root, name='api-root'),

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
