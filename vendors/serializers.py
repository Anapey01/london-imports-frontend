"""
Londom Imports - Vendor Serializers
"""
from rest_framework import serializers
from .models import Vendor, Payout


class VendorSerializer(serializers.ModelSerializer):
    """Vendor profile serializer"""
    reliability_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Vendor
        fields = [
            'id', 'business_name', 'slug', 'description', 'logo',
            'business_phone', 'business_email', 'whatsapp',
            'city', 'region',
            'total_orders', 'fulfilled_orders', 
            'fulfillment_rate', 'on_time_rate', 'reliability_display',
            'is_active', 'is_verified',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'total_orders', 'fulfilled_orders',
            'fulfillment_rate', 'on_time_rate', 'is_verified',
            'created_at', 'updated_at'
        ]


class VendorPublicSerializer(serializers.ModelSerializer):
    """Public vendor info for customers"""
    reliability_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Vendor
        fields = [
            'id', 'business_name', 'slug', 'description', 'logo',
            'city', 'region',
            'fulfillment_rate', 'reliability_display', 'is_verified'
        ]


class PayoutSerializer(serializers.ModelSerializer):
    """Vendor payout serializer"""
    
    class Meta:
        model = Payout
        fields = [
            'id', 'amount', 'platform_fee', 'net_amount',
            'status', 'transfer_reference',
            'created_at', 'processed_at'
        ]
        read_only_fields = ['id', 'platform_fee', 'net_amount', 'status', 'transfer_reference', 'created_at', 'processed_at']
