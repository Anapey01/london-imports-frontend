"""
Londom Imports - Order Serializers
Cart, checkout, and order tracking
"""
from rest_framework import serializers
from django.utils import timezone
from .models import Order, OrderItem, OrderState, Batch, OrderStateLog
from products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    """Order item serializer"""
    product_data = ProductListSerializer(source='product', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_data',
            'product_name', 'product_sku',
            'quantity', 'unit_price', 'total_price'
        ]
        read_only_fields = ['id', 'product_name', 'product_sku', 'total_price']


class OrderItemCreateSerializer(serializers.Serializer):
    """Add item to cart/order"""
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class BatchSerializer(serializers.ModelSerializer):
    """Batch info for order display"""
    is_open = serializers.ReadOnlyField()
    
    class Meta:
        model = Batch
        fields = [
            'id', 'name', 'delivery_date', 'cutoff_datetime',
            'status', 'is_open'
        ]


class OrderListSerializer(serializers.ModelSerializer):
    """Order list view - minimal info"""
    items_count = serializers.SerializerMethodField()
    state_display = serializers.CharField(source='get_state_display', read_only=True)
    delivery_window = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'state', 'state_display',
            'total', 'items_count', 'delivery_window',
            'created_at', 'paid_at'
        ]
    
    def get_items_count(self, obj):
        return obj.items.count()


class OrderDetailSerializer(serializers.ModelSerializer):
    """
    Full order detail - matches website_specification.md order confirmation page
    Shows: order ID, product summary, current stage, next update date, support contact
    """
    items = OrderItemSerializer(many=True, read_only=True)
    batch = BatchSerializer(read_only=True)
    state_display = serializers.CharField(source='get_state_display', read_only=True)
    delivery_window = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'state', 'state_display',
            'items', 'batch',
            'subtotal', 'delivery_fee', 'platform_fee', 'total',
            'amount_paid', 'deposit_amount', 'balance_due',
            'delivery_address', 'delivery_city', 'delivery_region',
            'delivery_window',
            'estimated_delivery_start', 'estimated_delivery_end',
            'customer_notes',
            'created_at', 'updated_at', 'paid_at', 'delivered_at'
        ]


class OrderStateLogSerializer(serializers.ModelSerializer):
    """Order state transition log"""
    from_state_display = serializers.SerializerMethodField()
    to_state_display = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderStateLog
        fields = [
            'id', 'from_state', 'from_state_display',
            'to_state', 'to_state_display',
            'reason', 'created_at'
        ]
    
    def get_from_state_display(self, obj):
        return dict(OrderState.choices).get(obj.from_state, obj.from_state)
    
    def get_to_state_display(self, obj):
        return dict(OrderState.choices).get(obj.to_state, obj.to_state)


class CartAddSerializer(serializers.Serializer):
    """Add to cart"""
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class CheckoutSerializer(serializers.Serializer):
    """Checkout - finalize order details before payment"""
    delivery_address = serializers.CharField(max_length=500)
    delivery_city = serializers.CharField(max_length=100)
    delivery_region = serializers.CharField(max_length=100)
    customer_notes = serializers.CharField(required=False, allow_blank=True, default='')
    payment_type = serializers.ChoiceField(choices=['FULL', 'DEPOSIT'])


class OrderTrackingSerializer(serializers.ModelSerializer):
    """Order tracking with timeline"""
    state_logs = OrderStateLogSerializer(many=True, read_only=True)
    state_display = serializers.CharField(source='get_state_display', read_only=True)
    delivery_window = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'state', 'state_display',
            'delivery_window',
            'estimated_delivery_start', 'estimated_delivery_end',
            'state_logs'
        ]
