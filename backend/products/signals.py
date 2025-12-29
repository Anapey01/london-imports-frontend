from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count
from .models import Review

@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def update_product_rating(sender, instance, **kwargs):
    """
    Recalculate product rating and count whenever a review is saved or deleted.
    """
    product = instance.product
    
    # Calculate aggregates
    aggregates = product.reviews.aggregate(
        average_rating=Avg('rating'),
        review_count=Count('id')
    )
    
    # Update fields
    product.rating = aggregates['average_rating'] or 0.0
    product.rating_count = aggregates['review_count'] or 0
    product.save()
