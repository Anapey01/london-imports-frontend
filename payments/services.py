"""
Londom Imports - Paystack Service
Payment initialization, verification, and webhook handling
"""
import hashlib
import hmac
import requests
from decimal import Decimal
from django.conf import settings
from django.utils import timezone

from .models import Payment, PaymentState, PaymentWebhookLog, Refund


class PaystackService:
    """
    Paystack API integration.
    Handles payment initialization, verification, and split payments.
    """
    
    BASE_URL = 'https://api.paystack.co'
    
    def __init__(self):
        self.secret_key = settings.PAYSTACK_SECRET_KEY
        self.public_key = settings.PAYSTACK_PUBLIC_KEY
    
    @property
    def headers(self):
        return {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json'
        }
    
    def initialize_payment(
        self,
        order,
        amount: Decimal,
        payment_type: str = 'FULL',
        callback_url: str = None
    ):
        """
        Initialize a Paystack transaction.
        Returns payment reference and authorization URL.
        """
        import uuid
        
        reference = f"LI-{order.order_number}-{uuid.uuid4().hex[:8]}"
        amount_kobo = int(amount * 100)  # Convert to kobo (pesewas for GHS)
        
        payload = {
            'email': order.customer.email,
            'amount': amount_kobo,
            'currency': 'GHS',
            'reference': reference,
            'callback_url': callback_url or f'{settings.FRONTEND_URL}/orders/{order.order_number}/payment-callback',
            'metadata': {
                'order_id': str(order.id),
                'order_number': order.order_number,
                'customer_id': str(order.customer.id),
                'payment_type': payment_type,
            },
            'channels': ['mobile_money', 'card', 'bank_transfer']
        }
        
        # Add split payment for vendor payout (optional)
        # This would split payment between platform and vendor
        # if self._should_split_payment(order):
        #     payload['split'] = self._create_split_config(order)
        
        response = requests.post(
            f'{self.BASE_URL}/transaction/initialize',
            json=payload,
            headers=self.headers
        )
        
        if response.status_code != 200:
            raise PaystackError(f"Failed to initialize payment: {response.text}")
        
        data = response.json()
        if not data.get('status'):
            raise PaystackError(data.get('message', 'Payment initialization failed'))
        
        # Create payment record
        payment = Payment.objects.create(
            order=order,
            amount=amount,
            payment_type=payment_type,
            paystack_reference=reference,
            paystack_access_code=data['data'].get('access_code', ''),
            state=PaymentState.PENDING
        )
        
        return {
            'reference': reference,
            'access_code': data['data'].get('access_code'),
            'authorization_url': data['data'].get('authorization_url'),
            'payment_id': str(payment.id)
        }
    
    def verify_payment(self, reference: str):
        """
        Verify a payment transaction.
        Called after customer completes payment.
        """
        response = requests.get(
            f'{self.BASE_URL}/transaction/verify/{reference}',
            headers=self.headers
        )
        
        if response.status_code != 200:
            return {'success': False, 'message': 'Verification failed'}
        
        data = response.json()
        
        if not data.get('status'):
            return {'success': False, 'message': data.get('message')}
        
        transaction = data['data']
        
        return {
            'success': transaction['status'] == 'success',
            'amount': Decimal(transaction['amount']) / 100,
            'currency': transaction['currency'],
            'channel': transaction['channel'],
            'gateway_response': transaction['gateway_response'],
            'paid_at': transaction['paid_at'],
            'authorization_code': transaction.get('authorization', {}).get('authorization_code'),
            'metadata': transaction.get('metadata', {})
        }
    
    def process_successful_payment(self, payment: Payment, verification_data: dict):
        """
        Process a successful payment.
        Updates payment and order states.
        """
        from orders.models import Order, OrderState
        
        # Update payment
        payment.state = PaymentState.CAPTURED
        payment.paid_at = timezone.now()
        payment.payment_method = self._get_payment_method(verification_data.get('channel'))
        payment.paystack_authorization_code = verification_data.get('authorization_code', '')
        payment.save()
        
        # Update order
        order = payment.order
        order.amount_paid += payment.amount
        order.paid_at = timezone.now()
        
        # Transition to PAID state
        if order.state == OrderState.PENDING_PAYMENT:
            order.transition_to(OrderState.PAID, None, 'Payment confirmed via Paystack')
            
            # Auto-assign to batch and transition to OPEN_FOR_BATCH
            self._assign_to_batch(order)
        
        order.save()
        
        return True
    
    def _assign_to_batch(self, order):
        """Assign order to current open batch or create new one"""
        from orders.models import Batch, OrderState
        
        # Find or create open batch
        batch = Batch.objects.filter(
            status=Batch.Status.OPEN,
            cutoff_datetime__gt=timezone.now()
        ).first()
        
        if not batch:
            # Create new batch for next week
            from datetime import timedelta
            cutoff = timezone.now() + timedelta(days=7)
            delivery_date = (timezone.now() + timedelta(weeks=3)).date()
            
            batch = Batch.objects.create(
                name=f"Batch {cutoff.strftime('%Y-W%W')}",
                cutoff_datetime=cutoff,
                delivery_date=delivery_date
            )
        
        order.batch = batch
        order.transition_to(OrderState.OPEN_FOR_BATCH, None, f'Assigned to batch {batch.name}')
        
        batch.total_orders += 1
        batch.save()
    
    def _get_payment_method(self, channel: str):
        """Map Paystack channel to our payment method"""
        mapping = {
            'mobile_money': 'MOBILE_MONEY',
            'card': 'CARD',
            'bank_transfer': 'BANK_TRANSFER',
        }
        return mapping.get(channel, 'MOBILE_MONEY')
    
    def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        """Verify that webhook came from Paystack"""
        expected = hmac.new(
            self.secret_key.encode('utf-8'),
            payload,
            hashlib.sha512
        ).hexdigest()
        return hmac.compare_digest(expected, signature)
    
    def initiate_refund(self, payment: Payment, amount: Decimal, reason: str):
        """Initiate a refund via Paystack"""
        payload = {
            'transaction': payment.paystack_reference,
            'amount': int(amount * 100)
        }
        
        response = requests.post(
            f'{self.BASE_URL}/refund',
            json=payload,
            headers=self.headers
        )
        
        if response.status_code != 200:
            raise PaystackError(f"Refund failed: {response.text}")
        
        data = response.json()
        
        return {
            'success': data.get('status'),
            'refund_reference': data.get('data', {}).get('transaction', {}).get('reference')
        }


class PaystackError(Exception):
    """Custom Paystack error"""
    pass


# Singleton instance
paystack_service = PaystackService()
