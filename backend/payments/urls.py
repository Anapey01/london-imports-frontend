"""
Londom Imports - Payment URLs
"""
from django.urls import path
from .views import (
    InitiatePaymentView,
    VerifyPaymentView,
    PaystackWebhookView,
    OrderPaymentsView
)

urlpatterns = [
    path('initiate/', InitiatePaymentView.as_view(), name='payment-initiate'),
    path('verify/', VerifyPaymentView.as_view(), name='payment-verify'),
    path('webhook/', PaystackWebhookView.as_view(), name='paystack-webhook'),
    path('order/<str:order_number>/', OrderPaymentsView.as_view(), name='order-payments'),
]
