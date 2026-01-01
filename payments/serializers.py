"""
Londom Imports - Payment Serializers
"""
from rest_framework import serializers
from .models import Payment, PaymentState, Refund


class PaymentSerializer(serializers.ModelSerializer):
    """Payment detail"""
    state_display = serializers.CharField(source='get_state_display', read_only=True)
    payment_type_display = serializers.CharField(source='get_payment_type_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'currency',
            'payment_type', 'payment_type_display',
            'payment_method', 'payment_method_display',
            'state', 'state_display',
            'paystack_reference',
            'momo_phone', 'momo_provider',
            'is_held', 'released_at',
            'created_at', 'paid_at'
        ]


class InitiatePaymentSerializer(serializers.Serializer):
    """Initiate payment request"""
    order_number = serializers.CharField()
    payment_type = serializers.ChoiceField(choices=['FULL', 'DEPOSIT', 'BALANCE'])
    callback_url = serializers.URLField(required=False)


class PaymentCallbackSerializer(serializers.Serializer):
    """Payment callback from Paystack"""
    reference = serializers.CharField()


class RefundSerializer(serializers.ModelSerializer):
    """Refund detail"""
    reason_display = serializers.CharField(source='get_reason_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Refund
        fields = [
            'id', 'amount',
            'reason', 'reason_display',
            'status', 'status_display',
            'notes', 'created_at', 'completed_at'
        ]
