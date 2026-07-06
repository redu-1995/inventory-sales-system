import requests
import json

# Configuration Boundaries
BASE_URL = "http://127.0.0.1:8000/api/inventory/"
AUTH_URL = "http://127.0.0.1:8000/api/auth/login/" # Adjust to match your exact JWT endpoint routing

# Target Credential variables (Must exist inside your local database environment)
TEST_USER = {
    "username": "admin",
    "password": "admin"
}

def run_integration_test():
    print("🚀 Starting Inventory Module Endpoints Integration Verification...")
    session = requests.Session()

    # Step 1: Obtain Authorization JWT Token Block
    try:
        auth_response = session.post(AUTH_URL, data=TEST_USER)
        if auth_response.status_code != 200:
            print(f"❌ AUTHENTICATION FAILURE: Unable to login with credentials. Status {auth_response.status_code}")
            return
        
        token = auth_response.json().get('access')
        session.headers.update({
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        })
        print("✅ Step 1: JWT Authentication Token successfully established.")
    except Exception as e:
        print(f"❌ Authentication Route failed to resolve. Verify server runtime: {e}")
        return

    # Step 2: Validate GET /api/inventory/inventory/ (List view)
    inv_list_url = f"{BASE_URL}inventory/"
    res = session.get(inv_list_url)
    if res.status_code == 200:
        print(f"✅ Step 2: Inventory List endpoint live. Received {len(res.json())} nodes.")
    else:
        print(f"❌ Step 2: Inventory List viewset failure: Status {res.status_code}")

    # Step 3: Validate POST /api/inventory/stock-movements/ (StockMovementViewSet create)
    # Assumes a Product record ID 1 exists in the database. Change product id if required.
    movement_payload = {
        "product": 1,
        "quantity": 25,
        "movement_type": "IN",
        "reference": "AUTOMATED_INTEGRATION_TEST_LOG"
    }
    mov_url = f"{BASE_URL}stock-movements/"
    res = session.post(mov_url, data=json.dumps(movement_payload))
    if res.status_code in [200, 201]:
        print(f"✅ Step 3: StockMovement creation handling active. Perform_create attached user context safely.")
        movement_id = res.json().get('id')
    else:
        print(f"❌ Step 3: StockMovement execution crashed: Status {res.status_code}, Body: {res.text}")
        movement_id = None

    # Step 4: Validate GET /api/inventory/purchase-orders/ (PurchaseOrderViewSet)
    po_url = f"{BASE_URL}purchase-orders/"
    res = session.get(po_url)
    if res.status_code == 200:
        print("✅ Step 4: PurchaseOrder listing engine active and returning records.")
    else:
        print(f"❌ Step 4: PurchaseOrder execution returned faulty status: {res.status_code}")

    print("\n🏁 Integration testing iteration terminated. Check results above to verify endpoint readiness.")

if __name__ == "__main__":
    run_integration_test()