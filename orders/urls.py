"""
Londom Imports - Order URLs
"""
from django.urls import path
from .views import (
    CartView,
    CheckoutView,
    OrderListView,
    OrderDetailView,
    OrderTrackingView,
    CancelOrderView,
    CancelOrderView,
    VendorOrderListView,
    PublicPlatformStatsView
)

urlpatterns = [
    # Public Stats
    path('stats/', PublicPlatformStatsView.as_view(), name='platform-stats'),
    
    # Customer cart & checkout
    path('cart/', CartView.as_view(), name='cart'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    
    # Customer orders
    path('', OrderListView.as_view(), name='order-list'),
    path('<str:order_number>/', OrderDetailView.as_view(), name='order-detail'),
    path('<str:order_number>/track/', OrderTrackingView.as_view(), name='order-tracking'),
    path('<str:order_number>/cancel/', CancelOrderView.as_view(), name='order-cancel'),
    
    # Vendor orders
    path('vendor/orders/', VendorOrderListView.as_view(), name='vendor-orders'),
]
