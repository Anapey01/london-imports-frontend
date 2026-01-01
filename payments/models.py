"""
Londom Imports - Payment Models
Paystack integration with escrow-like logic
"""
from django.db import models
from django.conf import settings
import uuid


class PaymentState(models.TextChoices):
    """Payment state machine"""
    PENDING = 'PENDING', 'Pending'
    AUTHORIZED = 'AUTHORIZED', 'Authorized'
    CAPTURED = 'CAPTURED', 'Captured'
    FAILED = 'FAILED', 'Failed'
    REFUNDED = 'REFUNDED', 'Refunded'
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED', 'Partially Refunded'


class Payment(models.Model):
    """
    Payment records for orders.
    Implements escrow-like logic - funds held until fulfillment.
    """
    
    class PaymentType(models.TextChoices):
        FULL = 'FULL', 'Full Payment'
        DEPOSIT = 'DEPOSIT', 'Deposit'
        BALANCE = 'BALANCE', 'Balance Payment'
    
    class PaymentMethod(models.TextChoices):
        MOBILE_MONEY = 'MOBILE_MONEY', 'Mobile Money'
        CARD = 'CARD', 'Card'
        BANK_TRANSFER = 'BANK_TRANSFER', 'Bank Transfer'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey('orders.Order', on_delete=models.PROTECT, related_name='payments')
    
    # Amount
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='GHS')
    
    # Type
    payment_type = models.CharField(
        max_length=20,
        choices=PaymentType.choices,
        default=PaymentType.FULL
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.MOBILE_MONEY
    )
    
    # State
    state = models.CharField(
        max_length=25,
        choices=PaymentState.choices,
        default=PaymentState.PENDING
    )
    
    # Paystack fields
    paystack_reference = models.CharField(max_length=100, unique=True)
    paystack_access_code = models.CharField(max_length=100, blank=True)
    paystack_authorization_code = models.CharField(max_length=100, blank=True)
    
    # Mobile Money specific
    momo_phone = models.CharField(max_length=15, blank=True)
    momo_provider = models.CharField(max_length=50, blank=True)  # MTN, Vodafone, AirtelTigo
    
    # Escrow tracking
    is_held = models.BooleanField(default=True, help_text="Funds held until delivery confirmed")
    released_at = models.DateTimeField(null=True, blank=True)
    released_to_vendor_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    # Error tracking
    failure_reason = models.TextField(blank=True)
    
    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment {self.paystack_reference} - GHS {self.amount} ({self.get_state_display()})"


class PaymentWebhookLog(models.Model):
    """Log all Paystack webhooks for audit and debugging"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    event_type = models.CharField(max_length=100)
    reference = models.CharField(max_length=100, db_index=True)
    payload = models.JSONField()
    
    processed = models.BooleanField(default=False)
    processing_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'payment_webhook_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.event_type} - {self.reference}"


class Refund(models.Model):
    """Refund records with clear triggers"""
    
    class Reason(models.TextChoices):
        CANCELLED_BEFORE_CUTOFF = 'CANCELLED_BEFORE_CUTOFF', 'Cancelled Before Cutoff'
        DELIVERY_FAILED = 'DELIVERY_FAILED', 'Delivery Failed'
        VENDOR_DEFAULT = 'VENDOR_DEFAULT', 'Vendor Default'
        CUSTOMER_REQUEST = 'CUSTOMER_REQUEST', 'Customer Request'
        ADMIN_DECISION = 'ADMIN_DECISION', 'Admin Decision'
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PROCESSING = 'PROCESSING', 'Processing'
        COMPLETED = 'COMPLETED', 'Completed'
        FAILED = 'FAILED', 'Failed'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT, related_name='refunds')
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.CharField(max_length=30, choices=Reason.choices)
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    # Paystack refund reference
    refund_reference = models.CharField(max_length=100, blank=True)
    
    # Who initiated
    initiated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True
    )
    notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'refunds'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Refund {self.amount} - {self.get_reason_display()}"
