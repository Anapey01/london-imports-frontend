"""
Londom Imports - Product Admin
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
        'name', 'vendor', 'category', 'price',
        'preorder_status', 'reservations_count', 'is_active', 'is_featured'
    ]
    list_filter = ['preorder_status', 'category', 'is_active', 'is_featured']
    search_fields = ['name', 'sku', 'vendor__business_name']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['reservations_count', 'created_at', 'updated_at']
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'sku', 'description', 'image')
        }),
        ('Categorization', {
            'fields': ('category', 'vendor')
        }),
        ('Pricing', {
            'fields': ('price', 'deposit_amount')
        }),
        ('Pre-order Settings', {
            'fields': ('preorder_status', 'estimated_weeks', 'cutoff_datetime')
        }),
        ('Inventory', {
            'fields': ('stock_quantity', 'reservations_count')
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured', 'created_at', 'updated_at')
        }),
    )
