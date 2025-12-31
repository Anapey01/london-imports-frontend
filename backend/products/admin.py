"""
Londom Imports - Product Admin (Simplified for Easy Upload)
"""
from django.contrib import admin
from .models import Category, Product, ProductImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'price', 'preorder_status', 'is_active'
    ]
    list_filter = ['preorder_status', 'category', 'is_active']
    search_fields = ['name', 'sku']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['reservations_count', 'created_at', 'updated_at']
    inlines = [ProductImageInline]
    
    # Simplified fieldsets - Essential fields first, advanced options collapsed
    fieldsets = (
        ('Product Details', {
            'description': 'Fill in the basic product information',
            'fields': ('name', 'slug', 'image', 'category', 'price', 'description')
        }),
        ('Pre-order Settings', {
            'description': 'Set delivery timeline',
            'fields': ('estimated_weeks', 'cutoff_datetime')
        }),
        ('Advanced Options', {
            'classes': ('collapse',),  # Collapsed by default!
            'description': 'Optional settings (click to expand)',
            'fields': (
                'sku', 'vendor', 'deposit_amount', 'preorder_status',
                'stock_quantity', 'is_active', 'is_featured',
                'rating', 'rating_count', 'reservations_count',
                'created_at', 'updated_at'
            )
        }),
    )
    
    # Set sensible defaults for new products
    def get_changeform_initial_data(self, request):
        return {
            'preorder_status': 'PREORDER',
            'is_active': True,
            'estimated_weeks': 3,
            'deposit_amount': 0,
        }

