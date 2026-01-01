"""
Londom Imports - Vendor Views
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Vendor, Payout
from .serializers import VendorSerializer, VendorPublicSerializer, PayoutSerializer


class IsVendor(permissions.BasePermission):
    """Only allow vendors"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_vendor


class VendorDashboardView(APIView):
    """
    Vendor's own dashboard with metrics.
    """
    permission_classes = [IsVendor]
    
    def get(self, request):
        vendor = request.user.vendor_profile
        
        return Response({
            'profile': VendorSerializer(vendor).data,
            'metrics': {
                'total_orders': vendor.total_orders,
                'fulfilled_orders': vendor.fulfilled_orders,
                'fulfillment_rate': float(vendor.fulfillment_rate),
                'on_time_rate': float(vendor.on_time_rate),
            }
        })


class VendorProfileUpdateView(generics.UpdateAPIView):
    """
    Update vendor's own profile.
    """
    serializer_class = VendorSerializer
    permission_classes = [IsVendor]
    
    def get_object(self):
        return self.request.user.vendor_profile


class VendorPublicListView(generics.ListAPIView):
    """
    List verified vendors publicly.
    """
    serializer_class = VendorPublicSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Vendor.objects.filter(is_active=True, is_verified=True)


class VendorPublicDetailView(generics.RetrieveAPIView):
    """
    Get public vendor details by slug.
    """
    serializer_class = VendorPublicSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Vendor.objects.filter(is_active=True)
    lookup_field = 'slug'


class VendorPayoutListView(generics.ListAPIView):
    """
    List vendor's payouts.
    """
    serializer_class = PayoutSerializer
    permission_classes = [IsVendor]
    
    def get_queryset(self):
        return Payout.objects.filter(vendor=self.request.user.vendor_profile)
