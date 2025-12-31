"""
Londom Imports - User Views
Authentication endpoints with JWT
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

from .serializers import (
    UserRegistrationSerializer,
    VendorRegistrationSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    AdminRegistrationSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer
)

User = get_user_model()


class CustomerRegistrationView(generics.CreateAPIView):
    """
    Register a new customer.
    No authentication required.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens for immediate login
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Registration successful',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class VendorRegistrationView(generics.CreateAPIView):
    """
    Register a new vendor.
    No authentication required.
    Vendors need admin approval before they can list products.
    """
    serializer_class = VendorRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Vendor registration successful. Await verification.',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get or update current user's profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """
    Change password for authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        
        return Response({'message': 'Password changed successfully'})


class LogoutView(APIView):
    """
    Logout by blacklisting the refresh token.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logged out successfully'})
        except Exception:
            return Response({'message': 'Logged out'})


class CurrentUserView(APIView):
    """
    Get current authenticated user info.
    Used by frontend to check auth status.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        data = UserProfileSerializer(user).data
        
        # Add vendor profile if vendor
        if user.is_vendor and hasattr(user, 'vendor_profile'):
            from vendors.serializers import VendorSerializer
            data['vendor_profile'] = VendorSerializer(user.vendor_profile).data
        
        return Response(data)


class AdminRegistrationView(generics.CreateAPIView):
    """
    Register a new admin user.
    Requires a valid secret key.
    """
    serializer_class = AdminRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        # Verify secret key
        secret_key = request.data.get('secret_key')
        # Default secret for development if not in settings
        # SECURITY: Fail if env var is missing, do not use fallback
        expected_secret = getattr(settings, 'ADMIN_REGISTRATION_SECRET', None)
        if not expected_secret:
             return Response({"error": "Admin registration disabled or misconfigured."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        if secret_key != expected_secret:
            return Response(
                {'error': 'Invalid admin registration secret key'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Admin registration successful',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class RequestPasswordResetView(APIView):
    """
    Request password reset email.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'message': 'If an account exists with this email, a reset link has been sent.'})
            
        # Generate token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Build reset link (public frontend URL)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        reset_link = f"{frontend_url}/admin/reset-password?uid={uid}&token={token}"
        
        # Send email (or log to console)
        try:
            send_mail(
                subject='Password Reset Request',
                message=f'Click the link to reset your password: {reset_link}',
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@londonsimports.com'),
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")
            print(f"DEBUG: Password Reset Link: {reset_link}")
            
        return Response({'message': 'If an account exists with this email, a reset link has been sent.'})


class PasswordResetConfirmView(APIView):
    """
    Confirm password reset with token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = serializer.validated_data['new_password']
        
        try:
            if not uid:
                raise ValueError("UID is missing")
            uid_decoded = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid_decoded)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid link'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(new_password)
        user.save()
        
        return Response({'message': 'Password has been reset successfully'})

# Cookie-based Token View
class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            
            # Helper to set cookie safely
            secure = not settings.DEBUG
            samesite = 'Lax' if settings.DEBUG else 'None' # Cross-site needs None + Secure if domains differ, but Lax is safer for same-site
            
            # If frontend/backend on different domains (e.g. Vercel vs Render), likely need "None"
            # Since we are using credentials: 'include', SameSite='None' Secure=True is typically best for cross-origin.
            # However, if on subdomain, Lax is fine. Let's assume cross-origin for now.
            if not settings.DEBUG:
                samesite = 'None'
            
            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,
                secure=secure,
                samesite=samesite,
                max_age=3600 # 1 hour
            )
            response.set_cookie(
                'refresh_token',
                refresh_token,
                httponly=True,
                secure=secure,
                samesite=samesite,
                max_age=3600 * 24 * 7 # 7 days
            )
            
            # Remove tokens from body to prevent localStorage usage
            del response.data['access']
            del response.data['refresh']
            
        return response

class CookieLogoutView(APIView):
    permission_classes = [permissions.AllowAny] # Allow anyone to call logout to clear cookies
    
    def post(self, request):
        response = Response({'message': 'Logged out successfully'})
        
        # Invalidate/Blacklist logic if we have the refresh token (difficult since it's in a cookie)
        # Typically we just clear the cookie.
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


from rest_framework_simplejwt.views import TokenRefreshView

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # In Cookie auth, the refresh token is in the cookie, not the body.
        # SimpleJWT expects 'refresh' in data. We must inject it.
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            request.data['refresh'] = refresh_token
            
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access_token = response.data.get('access')
            
            # Helper to set cookie safely
            secure = not settings.DEBUG
            samesite = 'None' if not settings.DEBUG else 'Lax'
            
            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,
                secure=secure,
                samesite=samesite,
                max_age=3600 # 1 hour
            )
            
            # Remove access from body
            del response.data['access']
            
            # Note: Refresh token might strictly rotate. If so, we need to set the new refresh cookie too.
            if 'refresh' in response.data:
                 refresh_token = response.data.get('refresh')
                 response.set_cookie(
                    'refresh_token',
                    refresh_token,
                    httponly=True,
                    secure=secure,
                    samesite=samesite,
                    max_age=3600 * 24 * 7
                )
                 del response.data['refresh']
            
        return response

