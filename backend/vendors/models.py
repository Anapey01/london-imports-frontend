"""
Londom Imports - Vendor Models
Vendor profiles with reliability scoring and payout tracking
"""
from django.db import models
from django.conf import settings
import uuid


class Vendor(models.Model):
    """
    Vendor profile for sellers on the platform.
    Tracks reliability and fulfillment metrics for trust building.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='vendor_profile'
    )
    
    # Business info
    business_name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='vendors/', blank=True)
    
    # Contact
    business_phone = models.CharField(max_length=15)
    business_email = models.EmailField()
    whatsapp = models.CharField(max_length=15, blank=True)
    
    # Location
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    
    # Payout info (for Paystack)
    bank_name = models.CharField(max_length=100, blank=True)
    bank_account_number = models.CharField(max_length=50, blank=True)
    bank_account_name = models.CharField(max_length=200, blank=True)
    paystack_subaccount_code = models.CharField(max_length=100, blank=True)
    
    # Reliability metrics (visible for trust building)
    total_orders = models.PositiveIntegerField(default=0)
    fulfilled_orders = models.PositiveIntegerField(default=0)
    on_time_deliveries = models.PositiveIntegerField(default=0)
    
    # Calculated scores
    fulfillment_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0,
        help_text="Percentage of orders fulfilled successfully"
    )
    on_time_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0,
        help_text="Percentage delivered within promised window"
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'vendors'
    
    def __str__(self):
        return self.business_name
    
    def update_metrics(self):
        """Recalculate vendor reliability metrics"""
        if self.total_orders > 0:
            self.fulfillment_rate = (self.fulfilled_orders / self.total_orders) * 100
            self.on_time_rate = (self.on_time_deliveries / self.total_orders) * 100
            self.save()
    
    @property
    def reliability_display(self):
        """Display reliability for customers"""
        if self.total_orders < 5:
            return "New Vendor"
        return f"{self.fulfillment_rate:.0f}% fulfilled"


class Payout(models.Model):
    """Vendor payout records"""
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PROCESSING = 'PROCESSING', 'Processing'
        COMPLETED = 'COMPLETED', 'Completed'
        FAILED = 'FAILED', 'Failed'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vendor = models.ForeignKey(Vendor, on_delete=models.PROTECT, related_name='payouts')
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    # Paystack transfer reference
    transfer_reference = models.CharField(max_length=100, blank=True)
    transfer_code = models.CharField(max_length=100, blank=True)
    
    # Notes
    notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'payouts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payout to {self.vendor.business_name} - GHS {self.amount}"
