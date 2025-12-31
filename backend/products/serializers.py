"""
Londom Imports - Product Serializers
Pre-order focused with delivery windows and demand signals
"""
from rest_framework import serializers
from .models import Product, Category, ProductImage, Review
from vendors.serializers import VendorPublicSerializer


class CategorySerializer(serializers.ModelSerializer):
    """Category serializer"""
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'product_count', 'is_active']
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    """Product image serializer"""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'order']


class ReviewSerializer(serializers.ModelSerializer):
    """Review serializer with user info"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductListSerializer(serializers.ModelSerializer):
    """
    Product list serializer - matches website_specification.md product cards
    Shows: image, name, preorder badge, price, demand signal
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    vendor_name = serializers.CharField(source='vendor.business_name', read_only=True)
    delivery_window_text = serializers.ReadOnlyField()
    is_preorder = serializers.ReadOnlyField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'image',
            'category', 'category_name',
            'vendor', 'vendor_name',
            'price', 'deposit_amount',
            'preorder_status', 'delivery_window_text',
            'cutoff_datetime', 'reservations_count',
            'rating', 'rating_count',
            'is_preorder', 'is_featured'
        ]
    
    def get_image(self, obj):
        """Return Cloudinary URL for the image"""
        if obj.image:
            # CloudinaryField has a .url property that returns the full URL
            return obj.image.url if hasattr(obj.image, 'url') else str(obj.image)
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """
    Product detail serializer - matches website_specification.md product page
    Shows full info including timeline and why preorder
    """
    category = CategorySerializer(read_only=True)
    vendor = VendorPublicSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    delivery_window_text = serializers.ReadOnlyField()
    is_preorder = serializers.ReadOnlyField()
    allows_deposit = serializers.ReadOnlyField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'description', 'image', 'images',
            'category', 'vendor',
            'price', 'deposit_amount', 'allows_deposit',
            'preorder_status', 'estimated_weeks', 'delivery_window_text',
            'cutoff_datetime', 'reservations_count',
            'rating', 'rating_count', 'reviews',
            'is_preorder', 'is_featured', 'stock_quantity',
            'created_at', 'updated_at'
        ]
    
    def get_image(self, obj):
        """Return Cloudinary URL for the image"""
        if obj.image:
            # CloudinaryField has a .url property that returns the full URL
            return obj.image.url if hasattr(obj.image, 'url') else str(obj.image)
        return None


class ProductCreateSerializer(serializers.ModelSerializer):
    """Create/update product - for vendors"""
    
    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'sku', 'description', 'image',
            'category', 'price', 'deposit_amount',
            'preorder_status', 'estimated_weeks', 'cutoff_datetime',
            'stock_quantity', 'is_active', 'is_featured'
        ]
    
    def create(self, validated_data):
        # Auto-assign vendor from request user
        validated_data['vendor'] = self.context['request'].user.vendor_profile
        return super().create(validated_data)
