"""
Londom Imports - Order Admin
Operational admin views for order management
"""
from django.contrib import admin
from .models import Order, OrderItem, Batch, OrderStateLog


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'product_sku', 'total_price']


class OrderStateLogInline(admin.TabularInline):
    model = OrderStateLog
    extra = 0
    readonly_fields = ['from_state', 'to_state', 'changed_by', 'reason', 'created_at']
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'customer', 'state', 'total',
        'batch', 'created_at', 'paid_at'
    ]
    list_filter = ['state', 'batch', 'created_at']
    search_fields = ['order_number', 'customer__username', 'customer__email']
    readonly_fields = [
        'id', 'order_number', 'created_at', 'updated_at',
        'paid_at', 'delivered_at', 'platform_fee'
    ]
    inlines = [OrderItemInline, OrderStateLogInline]
    
    fieldsets = (
        ('Order Info', {
            'fields': ('id', 'order_number', 'customer', 'state', 'batch')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'delivery_fee', 'platform_fee', 'total')
        }),
        ('Payment', {
            'fields': ('amount_paid', 'deposit_amount', 'balance_due')
        }),
        ('Delivery', {
            'fields': (
                'delivery_address', 'delivery_city', 'delivery_region',
                'estimated_delivery_start', 'estimated_delivery_end'
            )
        }),
        ('Notes', {
            'fields': ('customer_notes', 'internal_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'paid_at', 'delivered_at')
        }),
    )
    
    actions = ['mark_in_fulfillment', 'mark_out_for_delivery']
    
    def mark_in_fulfillment(self, request, queryset):
        for order in queryset.filter(state='CUTOFF_REACHED'):
            order.transition_to('IN_FULFILLMENT', request.user, 'Admin action')
        self.message_user(request, 'Orders marked as in fulfillment')
    mark_in_fulfillment.short_description = "Mark selected orders as In Fulfillment"
    
    def mark_out_for_delivery(self, request, queryset):
        for order in queryset.filter(state='IN_FULFILLMENT'):
            order.transition_to('OUT_FOR_DELIVERY', request.user, 'Admin action')
        self.message_user(request, 'Orders marked as out for delivery')
    mark_out_for_delivery.short_description = "Mark selected orders as Out for Delivery"


@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'delivery_date', 'cutoff_datetime',
        'status', 'total_orders', 'fulfilled_orders'
    ]
    list_filter = ['status', 'delivery_date']
    search_fields = ['name']
    readonly_fields = ['total_orders', 'fulfilled_orders', 'created_at']


@admin.register(OrderStateLog)
class OrderStateLogAdmin(admin.ModelAdmin):
    list_display = ['order', 'from_state', 'to_state', 'changed_by', 'created_at']
    list_filter = ['to_state', 'created_at']
    search_fields = ['order__order_number']
    readonly_fields = ['order', 'from_state', 'to_state', 'changed_by', 'reason', 'created_at']
