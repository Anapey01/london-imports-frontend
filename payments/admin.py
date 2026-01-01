"""
Londom Imports - Payment Admin
"""
from django.contrib import admin
from .models import Payment, PaymentWebhookLog, Refund


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'paystack_reference', 'order', 'amount', 'payment_type',
        'payment_method', 'state', 'created_at', 'paid_at'
    ]
    list_filter = ['state', 'payment_type', 'payment_method', 'is_held']
    search_fields = ['paystack_reference', 'order__order_number']
    readonly_fields = [
        'id', 'paystack_reference', 'paystack_access_code',
        'paystack_authorization_code', 'created_at', 'updated_at', 'paid_at'
    ]
    
    fieldsets = (
        ('Payment Info', {
            'fields': ('order', 'amount', 'currency', 'payment_type', 'payment_method')
        }),
        ('Paystack', {
            'fields': (
                'paystack_reference', 'paystack_access_code',
                'paystack_authorization_code', 'state'
            )
        }),
        ('Mobile Money', {
            'fields': ('momo_phone', 'momo_provider')
        }),
        ('Escrow', {
            'fields': ('is_held', 'released_at', 'released_to_vendor_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'paid_at')
        }),
        ('Errors', {
            'fields': ('failure_reason',),
            'classes': ('collapse',)
        }),
    )


@admin.register(PaymentWebhookLog)
class PaymentWebhookLogAdmin(admin.ModelAdmin):
    list_display = ['event_type', 'reference', 'processed', 'created_at']
    list_filter = ['event_type', 'processed', 'created_at']
    search_fields = ['reference', 'event_type']
    readonly_fields = ['event_type', 'reference', 'payload', 'created_at']


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ['payment', 'amount', 'reason', 'status', 'created_at', 'completed_at']
    list_filter = ['status', 'reason', 'created_at']
    search_fields = ['payment__paystack_reference', 'refund_reference']
    readonly_fields = ['created_at', 'completed_at']
