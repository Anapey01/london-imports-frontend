"""
Londom Imports - Product URLs
"""
from django.urls import path
from .views import (
    CategoryListView,
    ProductListView,
    ProductDetailView,
    ProductPreviewView,
    VendorProductListView,
    VendorProductDetailView,
    ReviewCreateView
)

urlpatterns = [
    # Public
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('preview/', ProductPreviewView.as_view(), name='product-preview'),
    path('', ProductListView.as_view(), name='product-list'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('<slug:slug>/reviews/', ReviewCreateView.as_view(), name='product-review-create'),
    
    # Vendor management
    path('vendor/products/', VendorProductListView.as_view(), name='vendor-product-list'),
    path('vendor/products/<uuid:pk>/', VendorProductDetailView.as_view(), name='vendor-product-detail'),
]
