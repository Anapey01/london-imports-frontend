"""
Londom Imports - Celery App Configuration
"""
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('londom_imports')

app.config_from_object('django.conf:settings', namespace='CELERY')

# Autodiscover tasks in all installed apps
app.autodiscover_tasks()

# Celery Beat schedule for periodic tasks
app.conf.beat_schedule = {
    # Check batch cutoffs every hour
    'check-batch-cutoffs': {
        'task': 'orders.tasks.check_batch_cutoffs',
        'schedule': crontab(minute=0),  # Every hour at :00
    },
    
    # Clean up abandoned carts daily at 3 AM
    'cleanup-abandoned-carts': {
        'task': 'orders.tasks.cleanup_abandoned_carts',
        'schedule': crontab(hour=3, minute=0),
    },
    
    # Send delivery reminders daily at 6 PM
    'send-delivery-reminders': {
        'task': 'orders.tasks.send_delivery_reminders',
        'schedule': crontab(hour=18, minute=0),
    },
    
    # Process auto-confirmations daily at 10 AM
    'process-auto-confirmations': {
        'task': 'orders.tasks.process_auto_confirmations',
        'schedule': crontab(hour=10, minute=0),
    },
    
    # Calculate vendor payouts daily at midnight
    'calculate-vendor-payouts': {
        'task': 'orders.tasks.calculate_vendor_payouts',
        'schedule': crontab(hour=0, minute=0),
    },
}

app.conf.timezone = 'Africa/Accra'


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
