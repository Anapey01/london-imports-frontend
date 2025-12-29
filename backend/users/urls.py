"""
Londom Imports - User URLs
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    CustomerRegistrationView,
    VendorRegistrationView,
    UserProfileView,
    ChangePasswordView,
    LogoutView,
    CurrentUserView,
    AdminRegistrationView,
    RequestPasswordResetView,
    PasswordResetConfirmView
)

urlpatterns = [
    # Registration
    path('register/', CustomerRegistrationView.as_view(), name='customer-register'),
    path('register/vendor/', VendorRegistrationView.as_view(), name='vendor-register'),
    
    # JWT Auth
    path('login/', TokenObtainPairView.as_view(), name='token-obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Profile
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # Admin & Password Reset
    path('register/admin/', AdminRegistrationView.as_view(), name='admin-register'),
    path('password/reset/', RequestPasswordResetView.as_view(), name='password-reset-request'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
