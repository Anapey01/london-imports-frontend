import requests
import json
import random

url = "http://localhost:8000/api/v1/auth/register/vendor/"

# Generate random user to avoid conflicts
rand_id = random.randint(1000, 9999)
email = f"vendor{rand_id}@example.com"
name = f"Test Vendor {rand_id}"

payload = {
    "username": f"vendor{rand_id}",
    "email": email,
    "password": "Password123!",
    "password_confirm": "Password123!",
    "first_name": "Test",
    "last_name": "User",
    "phone": "0555555555",
    "business_name": name,
    "business_phone": "0555555555",
    "business_city": "Accra",
    "business_region": "Greater Accra",
    "business_address": "Test Address",
    "description": "Test Description",
    "whatsapp": "0555555555",
    "bank_name": "MTN Mobile Money",
    "bank_account_number": "0555555555",
    "bank_account_name": "Test User"
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
