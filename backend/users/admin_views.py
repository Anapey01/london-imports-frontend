"""
London's Imports - Admin API Views
Admin-only endpoints for dashboard statistics and management
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta

from orders.models import Order
from products.models import Product
from .serializers import UserProfileSerializer

User = get_user_model()


class IsAdminUser(permissions.BasePermission):
    """
    Permission check for admin users only.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_staff or request.user.is_superuser or request.user.role == 'ADMIN')
        )


class AdminStatsView(APIView):
    """
    Get admin dashboard statistics.
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        today = timezone.now().date()
        
        # User stats
        total_users = User.objects.count()
        new_users_today = User.objects.filter(date_joined__date=today).count()
        
        # Order stats
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status__in=['PENDING', 'CONFIRMED']).count()
        
        # Revenue (completed orders only)
        total_revenue = Order.objects.filter(
            status='COMPLETED'
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Product stats
        total_products = Product.objects.filter(is_active=True).count()
        
        return Response({
            'total_users': total_users,
            'new_users_today': new_users_today,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'total_revenue': float(total_revenue),
            'total_products': total_products,
        })


class AdminUsersListView(generics.ListAPIView):
    """
    List all users (paginated).
    """
    permission_classes = [IsAdminUser]
    serializer_class = UserProfileSerializer
    
    def get_queryset(self):
        queryset = User.objects.all().order_by('-date_joined')
        
        # Optional filters
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(username__icontains=search) |
                models.Q(email__icontains=search) |
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search)
            )
        
        return queryset


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Get, update or delete a specific user.
    """
    permission_classes = [IsAdminUser]
    serializer_class = UserProfileSerializer
    queryset = User.objects.all()


class AdminOrdersListView(generics.ListAPIView):
    """
    List all orders (paginated).
    """
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        from orders.models import Order
        queryset = Order.objects.all().order_by('-created_at')
        
        # Optional filters
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Simple serialization for list view
        orders = []
        for order in queryset[:50]:  # Limit to 50 for performance
            orders.append({
                'id': str(order.id),
                'order_number': order.order_number,
                'customer': order.customer.get_full_name() or order.customer.username,
                'customer_email': order.customer.email,
                'total': float(order.total_amount),
                'status': order.status,
                'created_at': order.created_at.isoformat(),
            })
        
        return Response(orders)


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    """
    Get or update a specific order.
    """
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        from orders.models import Order
        return Order.objects.all()
    
    def retrieve(self, request, *args, **kwargs):
        order = self.get_object()
        return Response({
            'id': str(order.id),
            'order_number': order.order_number,
            'customer': order.customer.get_full_name() or order.customer.username,
            'customer_email': order.customer.email,
            'total': float(order.total_amount),
            'status': order.status,
            'created_at': order.created_at.isoformat(),
            'items': [
                {
                    'product': item.product.name,
                    'quantity': item.quantity,
                    'price': float(item.unit_price),
                }
                for item in order.items.all()
            ],
        })
    
    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        
        # Update status if provided
        new_status = request.data.get('status')
        if new_status:
            order.status = new_status
            order.save()
        
        return Response({'message': 'Order updated successfully'})


class AdminProductsListView(generics.ListAPIView):
    """
    List all products (paginated).
    """
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        from products.models import Product
        return Product.objects.all().order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        products = []
        for product in queryset[:50]:
            products.append({
                'id': str(product.id),
                'name': product.name,
                'slug': product.slug,
                'price': float(product.price),
                'stock': product.stock,
                'is_active': product.is_active,
                'is_featured': product.is_featured,
                'created_at': product.created_at.isoformat(),
            })
        
        return Response(products)


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Get, update or delete a specific product.
    """
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        from products.models import Product
        return Product.objects.all()
    
    def retrieve(self, request, *args, **kwargs):
        product = self.get_object()
        return Response({
            'id': str(product.id),
            'name': product.name,
            'slug': product.slug,
            'description': product.description,
            'price': float(product.price),
            'stock': product.stock,
            'is_active': product.is_active,
            'is_featured': product.is_featured,
        })
    
    def partial_update(self, request, *args, **kwargs):
        product = self.get_object()
        
        for field in ['name', 'description', 'price', 'stock', 'is_active', 'is_featured']:
            if field in request.data:
                setattr(product, field, request.data[field])
        
        product.save()
        return Response({'message': 'Product updated successfully'})


class AdminAnalyticsView(APIView):
    """
    Get analytics data for charts.
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        # Last 7 days of orders
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        from orders.models import Order
        
        daily_orders = []
        for i in range(7):
            date = week_ago + timedelta(days=i)
            count = Order.objects.filter(created_at__date=date).count()
            revenue = Order.objects.filter(
                created_at__date=date,
                status='COMPLETED'
            ).aggregate(total=Sum('total_amount'))['total'] or 0
            
            daily_orders.append({
                'date': date.isoformat(),
                'orders': count,
                'revenue': float(revenue),
            })
        
        return Response({
            'daily_stats': daily_orders,
        })


class AdminSettingsView(APIView):
    """
    Get or update site settings.
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        # Return placeholder settings
        return Response({
            'site_name': "London's Imports",
            'support_email': 'support@londonsimports.com',
            'maintenance_mode': False,
        })
    
    def patch(self, request):
        # In production, save to database or config
        return Response({'message': 'Settings updated successfully'})
