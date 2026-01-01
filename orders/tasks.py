"""
Londom Imports - Celery Tasks
Background tasks for batch processing, notifications, and cleanup
"""
from celery import shared_task
from django.utils import timezone
from datetime import timedelta


@shared_task
def check_batch_cutoffs():
    """
    Check for batches that have reached cutoff time.
    Run every hour via Celery Beat.
    """
    from orders.models import Batch, Order, OrderState
    
    now = timezone.now()
    
    # Find open batches past cutoff
    expired_batches = Batch.objects.filter(
        status=Batch.Status.OPEN,
        cutoff_datetime__lte=now
    )
    
    for batch in expired_batches:
        # Close the batch
        batch.status = Batch.Status.CLOSED
        batch.save()
        
        # Transition all orders in batch to CUTOFF_REACHED
        orders = Order.objects.filter(
            batch=batch,
            state=OrderState.OPEN_FOR_BATCH
        )
        
        for order in orders:
            order.transition_to(
                OrderState.CUTOFF_REACHED, 
                None, 
                f'Batch {batch.name} cutoff reached'
            )
        
        # Notify admin
        from orders.services import notification_service
        notification_service.notify_batch_cutoff(batch)
    
    return f"Processed {expired_batches.count()} batches"


@shared_task
def cleanup_abandoned_carts():
    """
    Clean up draft orders (carts) that haven't been touched in 7 days.
    Run daily via Celery Beat.
    """
    from orders.models import Order, OrderState
    
    cutoff = timezone.now() - timedelta(days=7)
    
    abandoned = Order.objects.filter(
        state=OrderState.DRAFT,
        updated_at__lt=cutoff
    )
    
    count = abandoned.count()
    
    # Mark as abandoned, don't delete (for analytics)
    abandoned.update(state=OrderState.ABANDONED)
    
    return f"Marked {count} abandoned carts"


@shared_task
def send_delivery_reminders():
    """
    Send reminders to customers about upcoming deliveries.
    Run daily via Celery Beat.
    """
    from orders.models import Order, OrderState
    from orders.services import notification_service
    
    tomorrow = timezone.now().date() + timedelta(days=1)
    
    orders = Order.objects.filter(
        state=OrderState.OUT_FOR_DELIVERY,
        estimated_delivery_start=tomorrow
    )
    
    for order in orders:
        # Send reminder SMS
        message = (
            f"Hi {order.customer.first_name}! Reminder: Your order "
            f"#{order.order_number} is scheduled for delivery tomorrow. "
            f"Please ensure someone is available to receive it."
        )
        notification_service.send_sms(order.customer.phone, message)
    
    return f"Sent {orders.count()} delivery reminders"


@shared_task
def process_auto_confirmations():
    """
    Auto-confirm deliveries that haven't been disputed.
    Per platform_principles.md: Auto-confirm after X hours.
    Run daily via Celery Beat.
    """
    from orders.models import Order, OrderState
    from django.conf import settings
    
    hours = getattr(settings, 'AUTO_CONFIRM_DELIVERY_HOURS', 48)
    cutoff = timezone.now() - timedelta(hours=hours)
    
    orders = Order.objects.filter(
        state=OrderState.OUT_FOR_DELIVERY,
        updated_at__lt=cutoff
    )
    
    count = 0
    for order in orders:
        order.transition_to(
            OrderState.DELIVERED,
            None,
            f'Auto-confirmed after {hours} hours'
        )
        order.delivered_at = timezone.now()
        order.save()
        count += 1
    
    return f"Auto-confirmed {count} deliveries"


@shared_task
def calculate_vendor_payouts():
    """
    Calculate and queue payouts for delivered orders.
    Run daily via Celery Beat.
    """
    from orders.models import Order, OrderState
    from vendors.models import Vendor, Payout
    from payments.models import Payment, PaymentState
    from django.db.models import Sum
    from django.conf import settings
    from decimal import Decimal
    
    # Find delivered orders without payouts
    orders = Order.objects.filter(
        state=OrderState.DELIVERED
    ).exclude(
        payments__is_held=False  # Already released
    )
    
    # Group by vendor
    vendor_totals = {}
    
    for order in orders:
        for item in order.items.all():
            vendor = item.product.vendor
            if vendor.id not in vendor_totals:
                vendor_totals[vendor.id] = {
                    'vendor': vendor,
                    'amount': Decimal('0'),
                    'orders': []
                }
            vendor_totals[vendor.id]['amount'] += item.total_price
            if order.id not in vendor_totals[vendor.id]['orders']:
                vendor_totals[vendor.id]['orders'].append(order.id)
    
    # Create payout records
    platform_fee_pct = Decimal(str(settings.PLATFORM_FEE_PERCENTAGE))
    payouts_created = 0
    
    for vendor_id, data in vendor_totals.items():
        vendor = data['vendor']
        gross_amount = data['amount']
        platform_fee = gross_amount * (platform_fee_pct / 100)
        net_amount = gross_amount - platform_fee
        
        if net_amount > 0:
            Payout.objects.create(
                vendor=vendor,
                amount=gross_amount,
                platform_fee=platform_fee,
                net_amount=net_amount,
                status=Payout.Status.PENDING,
                notes=f"Orders: {len(data['orders'])}"
            )
            payouts_created += 1
    
    return f"Created {payouts_created} payouts"


@shared_task
def send_order_notification(order_id: str, notification_type: str):
    """
    Generic task for sending order notifications.
    Called by signals to avoid blocking the request.
    """
    from orders.models import Order
    from orders.services import notification_service
    
    try:
        order = Order.objects.get(id=order_id)
        
        if notification_type == 'confirmed':
            notification_service.notify_order_confirmed(order)
        elif notification_type == 'shipped':
            notification_service.notify_order_shipped(order)
        elif notification_type == 'delivered':
            notification_service.notify_order_delivered(order)
        elif notification_type == 'cancelled':
            notification_service.notify_order_cancelled(order)
        
        return f"Sent {notification_type} notification for order {order.order_number}"
    except Order.DoesNotExist:
        return f"Order {order_id} not found"
