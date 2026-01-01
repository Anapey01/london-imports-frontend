"""
One-time migration to create superuser for Django admin.
Run once on first deployment, then this migration becomes a no-op.
"""
from django.db import migrations


def create_superuser(apps, schema_editor):
    User = apps.get_model('users', 'User')
    
    # Check if superuser already exists
    if User.objects.filter(username='admin').exists():
        print("Superuser 'admin' already exists - skipping creation")
        return
    
    # Create superuser with provided credentials
    User.objects.create(
        username='admin',
        email='admin@londonimports.com',
        password='pbkdf2_sha256$1000000$placeholder$placeholder',  # Will be set properly
        role='ADMIN',
        is_staff=True,
        is_superuser=True,
        is_active=True,
    )
    
    # Set the password properly using Django's password hasher
    user = User.objects.get(username='admin')
    from django.contrib.auth.hashers import make_password
    user.password = make_password('cd8f9b831b48c46a18af129ccf05d978')
    user.save()
    
    print("Superuser 'admin' created successfully!")


def reverse_create_superuser(apps, schema_editor):
    User = apps.get_model('users', 'User')
    User.objects.filter(username='admin').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_superuser, reverse_create_superuser),
    ]
