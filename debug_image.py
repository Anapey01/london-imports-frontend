
import os
import django
import sys

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from products.models import Product

def check_image():
    try:
        # Try to find the 'silver' product
        product = Product.objects.filter(slug='silver').first()
        if not product:
            print("Product 'silver' not found. Checking first available product.")
            product = Product.objects.first()
        
        if not product:
            print("No products found.")
            return

        print(f"Checking Product: {product.name}")
        print(f"Image Field Type: {type(product.image)}")
        print(f"Image Field Value: {product.image}")
        
        if product.image:
            print(f"Has 'url' attr: {hasattr(product.image, 'url')}")
            try:
                print(f"URL: {product.image.url}")
            except Exception as e:
                print(f"Error accessing .url: {e}")
                
            # CloudinaryResource specific attributes
            print(f"Has 'public_id': {hasattr(product.image, 'public_id')}")
            try:
                print(f"Public ID: {product.image.public_id}")
            except:
                pass
                
    except Exception as e:
        print(f"General Error: {e}")

if __name__ == "__main__":
    check_image()
