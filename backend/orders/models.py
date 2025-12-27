"""
Londom Imports - Order Models
Implements the order lifecycle state machine as defined in order_lifecycle.md
"""
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
import uuid


class OrderState(models.TextChoices):
    """Order state machine - matches order_lifecycle.md"""
    DRAFT = 'DRAFT', 'Draft'
    PENDING_PAYMENT = 'PENDING_PAYMENT', 'Pending Payment'
    PAID = 'PAID', 'Paid'
    OPEN_FOR_BATCH = 'OPEN_FOR_BATCH', 'Open for Batch'
    CUTOFF_REACHED = 'CUTOFF_REACHED', 'Cutoff Reached'
    IN_FULFILLMENT = 'IN_FULFILLMENT', 'In Fulfillment'
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', 'Out for Delivery'
    DELIVERED = 'DELIVERED', 'Delivered'
    FAILED = 'FAILED', 'Failed'
    CANCELLED = 'CANCELLED', 'Cancelled'
    REFUNDED = 'REFUNDED', 'Refunded'
    ABANDONED = 'ABANDONED', 'Abandoned'


# Valid state transitions - forbidden transitions will raise ValidationError
VALID_TRANSITIONS = {
    OrderState.DRAFT: [OrderState.PENDING_PAYMENT, OrderState.ABANDONED],
    OrderState.PENDING_PAYMENT: [OrderState.PAID, OrderState.DRAFT],
    OrderState.PAID: [OrderState.OPEN_FOR_BATCH, OrderState.CANCELLED],
    OrderState.OPEN_FOR_BATCH: [OrderState.CUTOFF_REACHED, OrderState.CANCELLED],
    OrderState.CUTOFF_REACHED: [OrderState.IN_FULFILLMENT],
    OrderState.IN_FULFILLMENT: [OrderState.OUT_FOR_DELIVERY],
    OrderState.OUT_FOR_DELIVERY: [OrderState.DELIVERED, OrderState.FAILED],
    OrderState.DELIVERED: [],  # Terminal state
    OrderState.FAILED: [OrderState.REFUNDED],
    OrderState.CANCELLED: [OrderState.REFUNDED],
    OrderState.REFUNDED: [],  # Terminal state
    OrderState.ABANDONED: [],  # Terminal state
}


class Batch(models.Model):
    """
    Batch groups orders by cutoff time.
    Orders never float freely - every paid order belongs to a batch.
    """
    
    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        CLOSED = 'CLOSED', 'Closed'
        FULFILLED = 'FULFILLED', 'Fulfilled'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)  # e.g., "Week 20 - Fashion Preorders"
    
    delivery_date = models.DateField(help_text="When items will be delivered")
    cutoff_datetime = models.DateTimeField(help_text="When orders close")
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN
    )
    
    # Metrics
    total_orders = models.PositiveIntegerField(default=0)
    fulfilled_orders = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'batches'
        verbose_name = 'Batch'
        verbose_name_plural = 'Batches'
        ordering = ['-cutoff_datetime']
    
    def __str__(self):
        return f"{self.name} (Cutoff: {self.cutoff_datetime.strftime('%Y-%m-%d %H:%M')})"
    
    @property
    def is_open(self):
        from django.utils import timezone
        return self.status == self.Status.OPEN and timezone.now() < self.cutoff_datetime


class Order(models.Model):
    """
    Order model with state machine implementation.
    State transitions are validated to prevent forbidden transitions.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=50, unique=True)
    
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='orders'
    )
    
    batch = models.ForeignKey(
        Batch,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )
    
    state = models.CharField(
        max_length=30,
        choices=OrderState.choices,
        default=OrderState.DRAFT
    )
    
    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Payment tracking
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_due = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Delivery info
    delivery_address = models.TextField(blank=True)
    delivery_city = models.CharField(max_length=100, blank=True)
    delivery_region = models.CharField(max_length=100, blank=True)
    
    # Delivery window (ranges, not exact dates - per master_lessons.md)
    estimated_delivery_start = models.DateField(null=True, blank=True)
    estimated_delivery_end = models.DateField(null=True, blank=True)
    actual_delivery_date = models.DateField(null=True, blank=True)
    
    # Notes
    customer_notes = models.TextField(blank=True)
    internal_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'orders'
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order {self.order_number} - {self.get_state_display()}"
    
    def save(self, *args, **kwargs):
        # Generate order number if not set
        if not self.order_number:
            self.order_number = self._generate_order_number()
        super().save(*args, **kwargs)
    
    def _generate_order_number(self):
        """Generate a unique order number"""
        from django.utils import timezone
        import random
        prefix = timezone.now().strftime('%Y%m%d')
        suffix = str(random.randint(1000, 9999))
        return f"LI-{prefix}-{suffix}"
    
    def transition_to(self, new_state: str, user=None, reason: str = ""):
        """
        Transition order to a new state with validation.
        Logs the transition for audit purposes.
        """
        old_state = self.state
        
        # Validate transition
        valid_next_states = VALID_TRANSITIONS.get(old_state, [])
        if new_state not in valid_next_states:
            raise ValidationError(
                f"Invalid state transition: {old_state} → {new_state}. "
                f"Valid transitions: {', '.join(valid_next_states) or 'None (terminal state)'}"
            )
        
        # Update state
        self.state = new_state
        self.save()
        
        # Log the transition
        OrderStateLog.objects.create(
            order=self,
            from_state=old_state,
            to_state=new_state,
            changed_by=user,
            reason=reason
        )
        
        return True
    
    @property
    def delivery_window(self):
        """Format delivery window for display"""
        if self.estimated_delivery_start and self.estimated_delivery_end:
            return f"{self.estimated_delivery_start.strftime('%b %d')} - {self.estimated_delivery_end.strftime('%b %d')}"
        return "To be confirmed"


class OrderItem(models.Model):
    """Items within an order"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.PROTECT)
    
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Snapshot product info at time of order
    product_name = models.CharField(max_length=200)
    product_sku = models.CharField(max_length=50, blank=True)
    
    class Meta:
        db_table = 'order_items'
    
    def __str__(self):
        return f"{self.quantity}x {self.product_name}"
    
    def save(self, *args, **kwargs):
        self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)


class OrderStateLog(models.Model):
    """Audit log for all state transitions - Admin actions must be traceable"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='state_logs')
    
    from_state = models.CharField(max_length=30)
    to_state = models.CharField(max_length=30)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    reason = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'order_state_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.order.order_number}: {self.from_state} → {self.to_state}"
