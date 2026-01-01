"""
Londom Imports - Vendor URLs
"""
from django.urls import path
from .views import (
    VendorDashboardView,
    VendorProfileUpdateView,
    VendorPublicListView,
    VendorPublicDetailView,
    VendorPayoutListView
)

urlpatterns = [
    # Vendor dashboard
    path('dashboard/', VendorDashboardView.as_view(), name='vendor-dashboard'),
    path('profile/', VendorProfileUpdateView.as_view(), name='vendor-profile-update'),
    path('payouts/', VendorPayoutListView.as_view(), name='vendor-payouts'),
    
    # Public vendor pages
    path('', VendorPublicListView.as_view(), name='vendor-list'),
    path('<slug:slug>/', VendorPublicDetailView.as_view(), name='vendor-detail'),
]
