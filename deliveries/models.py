"""
Londom Imports - Delivery Models
Delivery tracking with milestone-based status updates
"""
from django.db import models
from django.conf import settings
import uuid


class DeliveryStatus(models.TextChoices):
    """Delivery status matching website_specification.md milestones"""
    PENDING = 'PENDING', 'Pending'
    ASSIGNED = 'ASSIGNED', 'Rider Assigned'
    PICKED_UP = 'PICKED_UP', 'Picked Up'
    IN_TRANSIT = 'IN_TRANSIT', 'In Transit'
    ARRIVED_AT_HUB = 'ARRIVED_AT_HUB', 'Arrived at Hub'
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', 'Out for Delivery'
    DELIVERED = 'DELIVERED', 'Delivered'
    FAILED = 'FAILED', 'Failed'


class Delivery(models.Model):
    """
    Delivery tracking for orders.
    Shows clear milestones, not vague "processing" status.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField(
        'orders.Order',
        on_delete=models.PROTECT,
        related_name='delivery'
    )
    
    # Rider assignment
    rider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='deliveries'
    )
    
    # Status
    status = models.CharField(
        max_length=30,
        choices=DeliveryStatus.choices,
        default=DeliveryStatus.PENDING
    )
    
    # Delivery address (copied from order at creation)
    address = models.TextField()
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    
    # Customer contact
    recipient_name = models.CharField(max_length=200)
    recipient_phone = models.CharField(max_length=15)
    
    # Delivery window (ranges, not exact times)
    scheduled_date = models.DateField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    # Proof of delivery
    delivery_photo = models.ImageField(upload_to='deliveries/', blank=True)
    recipient_signature = models.ImageField(upload_to='signatures/', blank=True)
    
    # Notes
    delivery_notes = models.TextField(blank=True)
    failure_reason = models.TextField(blank=True)
    
    # Confirmation
    confirmed_by_customer = models.BooleanField(default=False)
    auto_confirmed = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'deliveries'
        verbose_name_plural = 'Deliveries'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Delivery for {self.order.order_number} - {self.get_status_display()}"


class DeliveryStatusLog(models.Model):
    """Log all delivery status changes for tracking visibility"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name='status_logs')
    
    from_status = models.CharField(max_length=30)
    to_status = models.CharField(max_length=30)
    
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    notes = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'delivery_status_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.delivery.order.order_number}: {self.from_status} → {self.to_status}"
