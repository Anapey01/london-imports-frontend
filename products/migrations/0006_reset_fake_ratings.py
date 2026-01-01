from django.db import migrations

def reset_ratings(apps, schema_editor):
    Product = apps.get_model('products', 'Product')
    # Update products that have default 5.0 rating but no reviews (rating_count=0)
    # We update all with rating_count=0 to be safe, setting them to 0.0
    Product.objects.filter(rating_count=0).update(rating=0.0)

class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_alter_product_rating_review'),
    ]

    operations = [
        migrations.RunPython(reset_ratings),
    ]
