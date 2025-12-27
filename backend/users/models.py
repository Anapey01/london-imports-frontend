"""
Londom Imports - Custom User Model
Supports Customer, Vendor, Admin, and Rider roles
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):
    """Custom user model with role-based access"""
    
    class Role(models.TextChoices):
        CUSTOMER = 'CUSTOMER', 'Customer'
        VENDOR = 'VENDOR', 'Vendor'
        ADMIN = 'ADMIN', 'Admin'
        RIDER = 'RIDER', 'Rider'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(
        max_length=20, 
        choices=Role.choices, 
        default=Role.CUSTOMER
    )
    phone = models.CharField(max_length=15, blank=True)
    whatsapp = models.CharField(max_length=15, blank=True)
    
    # Address fields for delivery
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    
    # Verification
    phone_verified = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def is_customer(self):
        return self.role == self.Role.CUSTOMER
    
    @property
    def is_vendor(self):
        return self.role == self.Role.VENDOR
    
    @property
    def is_admin_user(self):
        return self.role == self.Role.ADMIN
    
    @property
    def is_rider(self):
        return self.role == self.Role.RIDER
