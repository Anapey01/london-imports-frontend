"""
Londom Imports - User Serializers
Registration, login, and profile management
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Register new users - defaults to Customer role"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone', 'whatsapp',
            'address', 'city', 'region'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone': {'required': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({"password_confirm": "Passwords do not match"})
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            whatsapp=validated_data.get('whatsapp', ''),
            address=validated_data.get('address', ''),
            city=validated_data.get('city', ''),
            region=validated_data.get('region', ''),
            role=User.Role.CUSTOMER
        )
        return user


class VendorRegistrationSerializer(serializers.ModelSerializer):
    """Register new vendors - requires additional info"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    business_name = serializers.CharField(max_length=200)
    business_phone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    business_city = serializers.CharField(max_length=100)
    business_region = serializers.CharField(max_length=100)
    business_address = serializers.CharField(max_length=500, required=False, allow_blank=True)
    description = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    whatsapp = serializers.CharField(max_length=15, required=False, allow_blank=True)
    bank_name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    bank_account_number = serializers.CharField(max_length=50, required=False, allow_blank=True)
    bank_account_name = serializers.CharField(max_length=200, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone',
            'business_name', 'business_phone', 'business_city', 'business_region',
            'business_address', 'description', 'whatsapp',
            'bank_name', 'bank_account_number', 'bank_account_name'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({"password_confirm": "Passwords do not match"})
        return attrs
    
    def create(self, validated_data):
        # Extract vendor-specific fields
        business_name = validated_data.pop('business_name')
        business_phone = validated_data.pop('business_phone', '')
        business_city = validated_data.pop('business_city')
        business_region = validated_data.pop('business_region')
        business_address = validated_data.pop('business_address', '')
        description = validated_data.pop('description', '')
        whatsapp = validated_data.pop('whatsapp', '')
        bank_name = validated_data.pop('bank_name', '')
        bank_account_number = validated_data.pop('bank_account_number', '')
        bank_account_name = validated_data.pop('bank_account_name', '')
        
        # Create user with vendor role
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role=User.Role.VENDOR
        )
        
        # Create vendor profile
        from vendors.models import Vendor
        from django.utils.text import slugify
        
        Vendor.objects.create(
            user=user,
            business_name=business_name,
            slug=slugify(business_name),
            description=description,
            business_phone=business_phone or user.phone,
            business_email=user.email,
            whatsapp=whatsapp,
            address=business_address,
            city=business_city,
            region=business_region,
            bank_name=bank_name,
            bank_account_number=bank_account_number,
            bank_account_name=bank_account_name
        )
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """User profile for viewing/updating"""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone', 'whatsapp', 'address', 'city', 'region',
            'role', 'phone_verified', 'email_verified',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'username', 'role', 'created_at', 'updated_at']


class ChangePasswordSerializer(serializers.Serializer):
    """Change password"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect")
        return value


class AdminRegistrationSerializer(serializers.ModelSerializer):
    """Register new admin user (requires secret key)"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    secret_key = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password_confirm', 'secret_key']
        extra_kwargs = {
            'email': {'required': True}
        }
        
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({"password_confirm": "Passwords do not match"})
        return attrs

    def create(self, validated_data):
        # Secret key validation happens in the view
        validated_data.pop('secret_key', None)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=User.Role.ADMIN,
            is_staff=True,
            is_superuser=True
        )
        return user


class PasswordResetSerializer(serializers.Serializer):
    """Request password reset"""
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Confirm password reset"""
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return attrs
