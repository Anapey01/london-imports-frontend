"""
London's Imports - Admin API URLs
"""
from django.urls import path
from .admin_views import (
    AdminStatsView,
    AdminUsersListView,
    AdminUserDetailView,
    AdminOrdersListView,
    AdminOrderDetailView,
    AdminProductsListView,
    AdminProductDetailView,
    AdminProductDetailView,
    AdminProductFeatureView,
    AdminProductApproveView,
    AdminAnalyticsView,
    AdminSettingsView,
)

urlpatterns = [
    # Dashboard stats
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    
    # Users management
    path('users/', AdminUsersListView.as_view(), name='admin-users'),
    path('users/<uuid:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    
    # Orders management
    path('orders/', AdminOrdersListView.as_view(), name='admin-orders'),
    path('orders/<uuid:pk>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
    
    # Products management
    path('products/', AdminProductsListView.as_view(), name='admin-products'),
    path('products/<uuid:pk>/', AdminProductDetailView.as_view(), name='admin-product-detail'),
    path('products/<uuid:pk>/feature/', AdminProductFeatureView.as_view(), name='admin-product-feature'),
    path('products/<uuid:pk>/approve/', AdminProductApproveView.as_view(), name='admin-product-approve'),
    
    # Analytics
    path('analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    
    # Settings
    path('settings/', AdminSettingsView.as_view(), name='admin-settings'),
]
