"""
Londom Imports - Product Views
"""
from rest_framework import generics, permissions, filters
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from .models import Product, Category
from .serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductPreviewSerializer,
    ProductCreateSerializer,
    CategorySerializer,
    ReviewSerializer
)
from vendors.views import IsVendor
from rest_framework import status
from rest_framework.response import Response


class CategoryListView(generics.ListAPIView):
    """List all active categories"""
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.filter(is_active=True)


class ProductListView(generics.ListAPIView):
    """
    Public product listing with filtering.
    Supports category, preorder_status, and search filters.
    """
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'reservations_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Product.objects.filter(
            Q(vendor__is_active=True) | Q(vendor__isnull=True),
            is_active=True
        ).select_related('category', 'vendor')
        
        # Filter by category
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filter by preorder status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(preorder_status=status)
        
        # Featured only
        featured = self.request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        
        return queryset


class ProductPreviewView(generics.ListAPIView):
    """
    Public preview listing.
    Safe for guests/crawlers - no sensitive data.
    """
    serializer_class = ProductPreviewSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Product.objects.filter(is_active=True).select_related('category')
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'category__name']
    filterset_fields = ['slug']

    def get_queryset(self):
        # Allow category filtering
        queryset = super().get_queryset()
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    """Public product detail by slug"""
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Product.objects.filter(is_active=True)
    lookup_field = 'slug'


class ReviewCreateView(generics.CreateAPIView):
    """Create a review for a product"""
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        slug = self.kwargs.get('slug')
        product = generics.get_object_or_404(Product, slug=slug)
        
        # Unique constraint check is handled by model, but we associate user/product here
        serializer.save(user=self.request.user, product=product)


# Vendor product management
class VendorProductListView(generics.ListCreateAPIView):
    """Vendor's own products - list and create"""
    permission_classes = [IsVendor]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductCreateSerializer
        return ProductListSerializer
    
    def get_queryset(self):
        return Product.objects.filter(
            vendor=self.request.user.vendor_profile
        )


class VendorProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Vendor's own product - retrieve, update, delete"""
    permission_classes = [IsVendor]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProductCreateSerializer
        return ProductDetailSerializer
    
    def get_queryset(self):
        return Product.objects.filter(
            vendor=self.request.user.vendor_profile
        )
