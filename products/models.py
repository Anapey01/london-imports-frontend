"""
Londom Imports - Product Models
Pre-order focused product catalog with cutoff and delivery windows
"""
from django.db import models
from django.conf import settings
import uuid


class Category(models.Model):
    """Product categories - grouped by delivery logic, not just type"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    
    # Display order
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """
    Pre-order product model.
    Every product must clearly show preorder status and delivery window.
    """
    
    class PreorderStatus(models.TextChoices):
        PREORDER = 'PREORDER', 'Pre-order'
        CLOSING_SOON = 'CLOSING_SOON', 'Closing Soon'
        READY_TO_SHIP = 'READY_TO_SHIP', 'Ready to Ship'
        SOLD_OUT = 'SOLD_OUT', 'Sold Out'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic info
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    
    # Categorization
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    vendor = models.ForeignKey('vendors.Vendor', on_delete=models.PROTECT, related_name='products', null=True, blank=True)
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=0,
        help_text="If > 0, allows deposit-only ordering"
    )
    
    # Pre-order specific fields
    preorder_status = models.CharField(
        max_length=20,
        choices=PreorderStatus.choices,
        default=PreorderStatus.PREORDER
    )
    
    # Delivery window (ranges, not exact dates)
    estimated_weeks = models.PositiveIntegerField(
        default=3,
        help_text="Estimated weeks until delivery (e.g., 3-4 weeks)"
    )
    
    # Cutoff - when pre-orders close
    cutoff_datetime = models.DateTimeField(
        null=True, 
        blank=True,
        help_text="When pre-orders close for this product"
    )
    
    # Demand tracking (social proof)
    reservations_count = models.PositiveIntegerField(default=0)
    
    # Ratings (Manual for now, can be aggregated later)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0, help_text="Product rating (0.0 - 5.0)")
    rating_count = models.PositiveIntegerField(default=0, help_text="Number of ratings/reviews")
    
    # Images - Using CloudinaryField for direct cloud upload
    from cloudinary.models import CloudinaryField
    image = CloudinaryField('image', folder='products', blank=True, null=True)
    
    # Stock (for ready-to-ship items)
    stock_quantity = models.PositiveIntegerField(default=0)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'products'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.get_preorder_status_display()})"
    
    @property
    def delivery_window_text(self):
        """Display delivery window in user-friendly format"""
        return f"{self.estimated_weeks}-{self.estimated_weeks + 1} weeks"
    
    @property
    def allows_deposit(self):
        """Check if product allows deposit-only ordering"""
        return self.deposit_amount > 0
    
    @property
    def is_preorder(self):
        """Check if this is a pre-order product"""
        return self.preorder_status in [
            self.PreorderStatus.PREORDER, 
            self.PreorderStatus.CLOSING_SOON
        ]


class ProductImage(models.Model):
    """Additional product images"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    from cloudinary.models import CloudinaryField
    image = CloudinaryField('image', folder='products')
    alt_text = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        db_table = 'product_images'
        ordering = ['order']


class Review(models.Model):
    """Product reviews from users"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    rating = models.PositiveSmallIntegerField(help_text="Rating from 1 to 5")
    comment = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        unique_together = ['product', 'user']  # One review per product per user
    
    def __str__(self):
        return f"{self.rating}★ - {self.user} on {self.product.name}"
