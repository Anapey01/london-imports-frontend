"""
Londom Imports - Payment Views
Paystack payment handling and webhooks
"""
import json
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from orders.models import Order, OrderState
from .models import Payment, PaymentState, PaymentWebhookLog
from .serializers import (
    PaymentSerializer,
    InitiatePaymentSerializer,
    PaymentCallbackSerializer
)
from .services import paystack_service, PaystackError


class InitiatePaymentView(APIView):
    """
    Initiate payment for an order.
    Returns Paystack authorization URL for redirect.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = InitiatePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            order = Order.objects.get(
                order_number=serializer.validated_data['order_number'],
                customer=request.user,
                state=OrderState.PENDING_PAYMENT
            )
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found or not ready for payment'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payment_type = serializer.validated_data['payment_type']
        
        # Determine amount
        if payment_type == 'FULL':
            amount = order.total
        elif payment_type == 'DEPOSIT':
            amount = order.deposit_amount
        elif payment_type == 'BALANCE':
            amount = order.balance_due
        else:
            amount = order.total
        
        try:
            result = paystack_service.initialize_payment(
                order=order,
                amount=amount,
                payment_type=payment_type,
                callback_url=serializer.validated_data.get('callback_url')
            )
            
            return Response({
                'authorization_url': result['authorization_url'],
                'reference': result['reference'],
                'access_code': result['access_code']
            })
            
        except PaystackError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class VerifyPaymentView(APIView):
    """
    Verify payment after callback.
    Called by frontend after Paystack redirects back.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PaymentCallbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        reference = serializer.validated_data['reference']
        
        try:
            payment = Payment.objects.get(paystack_reference=reference)
        except Payment.DoesNotExist:
            return Response(
                {'error': 'Payment not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verify with Paystack
        result = paystack_service.verify_payment(reference)
        
        if result['success']:
            paystack_service.process_successful_payment(payment, result)
            
            return Response({
                'success': True,
                'message': 'Payment successful',
                'order_number': payment.order.order_number,
                'payment': PaymentSerializer(payment).data
            })
        else:
            payment.state = PaymentState.FAILED
            payment.failure_reason = result.get('message', 'Payment verification failed')
            payment.save()
            
            return Response({
                'success': False,
                'message': result.get('message', 'Payment verification failed')
            }, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class PaystackWebhookView(APIView):
    """
    Paystack webhook handler.
    Receives payment events from Paystack.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        # Verify signature
        signature = request.headers.get('X-Paystack-Signature', '')
        if not paystack_service.verify_webhook_signature(request.body, signature):
            return Response({'error': 'Invalid signature'}, status=400)
        
        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return Response({'error': 'Invalid payload'}, status=400)
        
        event = payload.get('event')
        data = payload.get('data', {})
        reference = data.get('reference', '')
        
        # Log webhook
        log = PaymentWebhookLog.objects.create(
            event_type=event,
            reference=reference,
            payload=payload
        )
        
        # Handle events
        if event == 'charge.success':
            self._handle_charge_success(data, log)
        elif event == 'transfer.success':
            self._handle_transfer_success(data, log)
        elif event == 'refund.processed':
            self._handle_refund_processed(data, log)
        
        return Response({'status': 'ok'})
    
    def _handle_charge_success(self, data, log):
        """Handle successful charge"""
        reference = data.get('reference')
        
        try:
            payment = Payment.objects.get(paystack_reference=reference)
            
            if payment.state != PaymentState.CAPTURED:
                verification = paystack_service.verify_payment(reference)
                if verification['success']:
                    paystack_service.process_successful_payment(payment, verification)
            
            log.processed = True
            log.processing_notes = 'Payment confirmed'
            log.save()
            
        except Payment.DoesNotExist:
            log.processing_notes = 'Payment not found'
            log.save()
    
    def _handle_transfer_success(self, data, log):
        """Handle successful transfer (vendor payout)"""
        from vendors.models import Payout
        
        transfer_code = data.get('transfer_code')
        
        try:
            payout = Payout.objects.get(transfer_code=transfer_code)
            payout.status = Payout.Status.COMPLETED
            payout.processed_at = timezone.now()
            payout.save()
            
            log.processed = True
            log.processing_notes = 'Payout completed'
            log.save()
            
        except Payout.DoesNotExist:
            log.processing_notes = 'Payout not found'
            log.save()
    
    def _handle_refund_processed(self, data, log):
        """Handle processed refund"""
        from .models import Refund
        from django.utils import timezone
        
        # Find and update refund
        log.processed = True
        log.processing_notes = 'Refund processed'
        log.save()


class OrderPaymentsView(APIView):
    """List payments for an order"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, order_number):
        try:
            order = Order.objects.get(
                order_number=order_number,
                customer=request.user
            )
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        payments = Payment.objects.filter(order=order)
        return Response(PaymentSerializer(payments, many=True).data)
