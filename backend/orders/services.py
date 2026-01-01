"""
Londom Imports - Notification Service
SMS and Email notifications for order events
"""
import requests
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string


class NotificationService:
    """
    Unified notification service for SMS and Email.
    Supports Hubtel/Termii for SMS and Django email backend.
    """
    
    def send_sms(self, phone: str, message: str) -> bool:
        """
        Send SMS via configured provider.
        Supports Hubtel and Termii.
        """
        phone = self._format_phone(phone)
        provider = getattr(settings, 'SMS_PROVIDER', 'hubtel')
        
        try:
            if provider == 'hubtel':
                return self._send_hubtel_sms(phone, message)
            elif provider == 'termii':
                return self._send_termii_sms(phone, message)
            else:
                print(f"Unknown SMS provider: {provider}")
                return False
        except Exception as e:
            print(f"SMS sending failed: {e}")
            return False
    
    def _send_hubtel_sms(self, phone: str, message: str) -> bool:
        """Send via Hubtel API"""
        client_id = getattr(settings, 'HUBTEL_CLIENT_ID', '')
        client_secret = getattr(settings, 'HUBTEL_CLIENT_SECRET', '')
        sender_id = getattr(settings, 'HUBTEL_SENDER_ID', 'LondomImport')
        
        if not client_id or not client_secret:
            print("Hubtel credentials not configured")
            return False
        
        url = f"https://smsc.hubtel.com/v1/messages/send"
        
        response = requests.get(url, params={
            'clientid': client_id,
            'clientsecret': client_secret,
            'from': sender_id,
            'to': phone,
            'content': message
        })
        
        return response.status_code == 200
    
    def _send_termii_sms(self, phone: str, message: str) -> bool:
        """Send via Termii API"""
        api_key = getattr(settings, 'TERMII_API_KEY', '')
        sender_id = getattr(settings, 'TERMII_SENDER_ID', 'LondomImport')
        
        if not api_key:
            print("Termii API key not configured")
            return False
        
        url = "https://api.ng.termii.com/api/sms/send"
        
        response = requests.post(url, json={
            'api_key': api_key,
            'to': phone,
            'from': sender_id,
            'sms': message,
            'type': 'plain',
            'channel': 'generic'
        })
        
        return response.status_code == 200
    
    def send_email(
        self, 
        to_email: str, 
        subject: str, 
        template: str, 
        context: dict
    ) -> bool:
        """
        Send email using Django's email backend.
        Uses templates for consistency.
        """
        try:
            html_content = render_to_string(f'emails/{template}.html', context)
            text_content = render_to_string(f'emails/{template}.txt', context)
            
            send_mail(
                subject=f"[Londom Imports] {subject}",
                message=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[to_email],
                html_message=html_content,
                fail_silently=False
            )
            return True
        except Exception as e:
            print(f"Email sending failed: {e}")
            return False
    
    def _format_phone(self, phone: str) -> str:
        """Format phone to international format"""
        phone = phone.replace(' ', '').replace('-', '')
        if phone.startswith('0'):
            phone = '233' + phone[1:]
        elif not phone.startswith('233') and not phone.startswith('+233'):
            phone = '233' + phone
        return phone.replace('+', '')
    
    # ========== Order Event Notifications ==========
    
    def notify_order_confirmed(self, order):
        """Send notification when order is paid and confirmed"""
        customer = order.customer
        
        # SMS
        message = (
            f"Hi {customer.first_name}! Your order #{order.order_number} is confirmed. "
            f"Total: GHS {order.total}. "
            f"Expected delivery: {order.estimated_delivery_start.strftime('%d %b')} - {order.estimated_delivery_end.strftime('%d %b')}. "
            f"Track at londomimports.com/orders/{order.order_number}"
        )
        self.send_sms(customer.phone, message)
        
        # Email
        self.send_email(
            to_email=customer.email,
            subject=f"Order #{order.order_number} Confirmed",
            template='order_confirmed',
            context={
                'customer': customer,
                'order': order,
                'items': order.items.all()
            }
        )
    
    def notify_order_shipped(self, order):
        """Send notification when order is out for delivery"""
        customer = order.customer
        
        message = (
            f"Hi {customer.first_name}! Great news - your order #{order.order_number} "
            f"is out for delivery! We'll call when we arrive."
        )
        self.send_sms(customer.phone, message)
        
        self.send_email(
            to_email=customer.email,
            subject=f"Order #{order.order_number} Out for Delivery",
            template='order_shipped',
            context={'customer': customer, 'order': order}
        )
    
    def notify_order_delivered(self, order):
        """Send notification when order is delivered"""
        customer = order.customer
        
        message = (
            f"Hi {customer.first_name}! Your order #{order.order_number} has been delivered. "
            f"Thank you for shopping with Londom Imports!"
        )
        self.send_sms(customer.phone, message)
        
        self.send_email(
            to_email=customer.email,
            subject=f"Order #{order.order_number} Delivered",
            template='order_delivered',
            context={'customer': customer, 'order': order}
        )
    
    def notify_order_cancelled(self, order, reason: str = ''):
        """Send notification when order is cancelled"""
        customer = order.customer
        
        message = (
            f"Hi {customer.first_name}, your order #{order.order_number} has been cancelled. "
            f"Refund will be processed within 3-5 business days."
        )
        self.send_sms(customer.phone, message)
        
        self.send_email(
            to_email=customer.email,
            subject=f"Order #{order.order_number} Cancelled",
            template='order_cancelled',
            context={'customer': customer, 'order': order, 'reason': reason}
        )
    
    def notify_vendor_new_order(self, vendor, order):
        """Notify vendor of new order containing their products"""
        user = vendor.user
        
        message = (
            f"New order #{order.order_number} contains your products! "
            f"Login to your dashboard to view details."
        )
        self.send_sms(user.phone, message)
        
        self.send_email(
            to_email=vendor.business_email,
            subject=f"New Order #{order.order_number}",
            template='vendor_new_order',
            context={'vendor': vendor, 'order': order}
        )
    
    def notify_batch_cutoff(self, batch):
        """Notify admin when batch cutoff is reached"""
        message = (
            f"Batch {batch.name} cutoff reached. "
            f"{batch.total_orders} orders ready for fulfillment."
        )
        # Send to admin phone/email
        print(f"Batch cutoff notification: {message}")


# Singleton instance
notification_service = NotificationService()
