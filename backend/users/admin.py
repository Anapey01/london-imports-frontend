"""
Londom Imports - User Admin
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'phone', 'is_active']
    list_filter = ['role', 'is_active', 'is_staff', 'phone_verified', 'email_verified']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role & Contact', {
            'fields': ('role', 'phone', 'whatsapp')
        }),
        ('Address', {
            'fields': ('address', 'city', 'region')
        }),
        ('Verification', {
            'fields': ('phone_verified', 'email_verified')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Profile', {
            'fields': ('email', 'role', 'phone')
        }),
    )
