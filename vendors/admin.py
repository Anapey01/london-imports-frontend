"""
Londom Imports - Vendor Admin
"""
from django.contrib import admin
from .models import Vendor, Payout


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = [
        'business_name', 'user', 'city', 'region',
        'total_orders', 'fulfillment_rate', 'is_verified', 'is_active'
    ]
    list_filter = ['is_verified', 'is_active', 'region']
    search_fields = ['business_name', 'user__username', 'user__email', 'business_phone']
    readonly_fields = ['total_orders', 'fulfilled_orders', 'fulfillment_rate', 'on_time_rate', 'created_at']
    
    fieldsets = (
        ('Business Info', {
            'fields': ('user', 'business_name', 'slug', 'description', 'logo')
        }),
        ('Contact', {
            'fields': ('business_phone', 'business_email', 'whatsapp')
        }),
        ('Location', {
            'fields': ('address', 'city', 'region')
        }),
        ('Payout Info', {
            'fields': ('bank_name', 'bank_account_number', 'bank_account_name', 'paystack_subaccount_code')
        }),
        ('Metrics', {
            'fields': ('total_orders', 'fulfilled_orders', 'fulfillment_rate', 'on_time_rate')
        }),
        ('Status', {
            'fields': ('is_active', 'is_verified', 'created_at')
        }),
    )


@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'amount', 'net_amount', 'status', 'created_at', 'processed_at']
    list_filter = ['status', 'created_at']
    search_fields = ['vendor__business_name', 'transfer_reference']
    readonly_fields = ['created_at', 'processed_at']
