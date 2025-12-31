"""
Londom Imports - User URLs
"""
from django.urls import path

# Use Cookie-based Auth Views
from .views import (
    CustomerRegistrationView,
    VendorRegistrationView,
    UserProfileView,
    ChangePasswordView,
    CurrentUserView,
    AdminRegistrationView,
    RequestPasswordResetView,
    PasswordResetConfirmView,
    CookieTokenObtainPairView, 
    CookieTokenRefreshView,
    CookieLogoutView
)

urlpatterns = [
    # Registration
    path('register/', CustomerRegistrationView.as_view(), name='customer-register'),
    path('register/vendor/', VendorRegistrationView.as_view(), name='vendor-register'),
    
    # Cookie-Based JWT Auth
    path('login/', CookieTokenObtainPairView.as_view(), name='token-obtain'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', CookieLogoutView.as_view(), name='logout'),
    
    # Profile
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # Admin & Password Reset
    path('register/admin/', AdminRegistrationView.as_view(), name='admin-register'),
    path('password/reset/', RequestPasswordResetView.as_view(), name='password-reset-request'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]

