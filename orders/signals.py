"""
Londom Imports - Django Signals for Order Events
Triggers notifications and analytics on state changes
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Order, OrderState, OrderStateLog
from .services import notification_service


@receiver(post_save, sender=OrderStateLog)
def on_order_state_change(sender, instance, created, **kwargs):
    """
    Trigger notifications when order state changes.
    This is the central hub for order event handling.
    """
    if not created:
        return
    
    order = instance.order
    new_state = instance.to_state
    
    # Dispatch based on new state
    if new_state == OrderState.PAID:
        notification_service.notify_order_confirmed(order)
        _track_analytics('order_paid', order)
        
    elif new_state == OrderState.OPEN_FOR_BATCH:
        # Notify vendor(s) of new order
        _notify_vendors_new_order(order)
        
    elif new_state == OrderState.OUT_FOR_DELIVERY:
        notification_service.notify_order_shipped(order)
        _track_analytics('order_shipped', order)
        
    elif new_state == OrderState.DELIVERED:
        notification_service.notify_order_delivered(order)
        _update_vendor_metrics(order)
        _track_analytics('order_delivered', order)
        
    elif new_state == OrderState.CANCELLED:
        notification_service.notify_order_cancelled(order, instance.reason)
        _track_analytics('order_cancelled', order)
        
    elif new_state == OrderState.REFUNDED:
        _track_analytics('order_refunded', order)


def _notify_vendors_new_order(order):
    """Notify each vendor whose products are in this order"""
    vendor_ids = set()
    for item in order.items.all():
        if item.product.vendor_id not in vendor_ids:
            vendor_ids.add(item.product.vendor_id)
            notification_service.notify_vendor_new_order(
                item.product.vendor, order
            )


def _update_vendor_metrics(order):
    """Update vendor fulfillment metrics after delivery"""
    from vendors.models import Vendor
    from django.utils import timezone
    
    vendor_ids = set()
    for item in order.items.all():
        vendor_ids.add(item.product.vendor_id)
    
    for vendor_id in vendor_ids:
        try:
            vendor = Vendor.objects.get(id=vendor_id)
            vendor.fulfilled_orders += 1
            
            # Check if on-time
            if order.delivered_at and order.estimated_delivery_end:
                if order.delivered_at.date() <= order.estimated_delivery_end:
                    # Update on-time rate
                    pass
            
            # Recalculate fulfillment rate
            if vendor.total_orders > 0:
                vendor.fulfillment_rate = (vendor.fulfilled_orders / vendor.total_orders) * 100
            
            vendor.save()
        except Vendor.DoesNotExist:
            pass


def _track_analytics(event_name: str, order):
    """
    Track event to PostHog or other analytics.
    Placeholder for Phase 6 PostHog integration.
    """
    # PostHog integration example:
    # posthog.capture(
    #     distinct_id=str(order.customer_id),
    #     event=event_name,
    #     properties={
    #         'order_id': str(order.id),
    #         'order_number': order.order_number,
    #         'total': float(order.total),
    #         'item_count': order.items.count(),
    #     }
    # )
    
    print(f"Analytics: {event_name} for order {order.order_number}")
