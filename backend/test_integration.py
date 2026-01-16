"""
Quick test script to verify backend API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    assert response.status_code == 200
    print("   ✅ Health check passed\n")

def test_auth_flow():
    """Test authentication flow"""
    print("🔍 Testing authentication flow...")
    
    # Test registration
    print("   1. Testing registration...")
    reg_data = {
        "email": "testuser@example.com",
        "password": "Test123!",
        "name": "Test User"
    }
    
    reg_response = requests.post(f"{BASE_URL}/api/auth/register", json=reg_data)
    
    if reg_response.status_code == 201:
        print(f"      ✅ Registration successful")
    elif reg_response.status_code == 400:
        # User might already exist
        print(f"      ⚠️  User already exists (this is okay)")
    else:
        print(f"      Status: {reg_response.status_code}")
        print(f"      Response: {reg_response.text}")
    
    # Test login
    print("   2. Testing login...")
    login_data = {
        "email": "testuser@example.com",
        "password": "Test123!"
    }
    
    login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"      Status: {login_response.status_code}")
    
    if login_response.status_code == 200:
        login_result = login_response.json()
        token = login_result.get("access_token")
        print(f"      ✅ Login successful")
        print(f"      Token: {token[:20]}...")
        return token
    else:
        print(f"      ❌ Login failed: {login_response.text}")
        return None

def test_tasks_api(token):
    """Test tasks API with authentication"""
    print("🔍 Testing tasks API...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Get all tasks
    print("   1. Getting all tasks...")
    get_response = requests.get(f"{BASE_URL}/api/tasks", headers=headers)
    print(f"      Status: {get_response.status_code}")
    
    if get_response.status_code == 200:
        tasks = get_response.json()
        print(f"      ✅ Found {len(tasks)} tasks")
    else:
        print(f"      ❌ Failed: {get_response.text}")
        return
    
    # Create a task
    print("   2. Creating a new task...")
    task_data = {
        "title": "Test Task from Python",
        "description": "This task was created by the integration test",
        "completed": False
    }
    
    create_response = requests.post(f"{BASE_URL}/api/tasks", json=task_data, headers=headers)
    print(f"      Status: {create_response.status_code}")
    
    if create_response.status_code == 200:
        new_task = create_response.json()
        print(f"      ✅ Task created: {new_task['title']}")
        task_id = new_task['id']
        
        # Toggle task completion
        print("   3. Toggling task completion...")
        toggle_response = requests.patch(f"{BASE_URL}/api/tasks/{task_id}/complete", headers=headers)
        
        if toggle_response.status_code == 200:
            updated_task = toggle_response.json()
            print(f"      ✅ Task completion toggled: {updated_task['completed']}")
        else:
            print(f"      ❌ Failed: {toggle_response.text}")
        
        # Delete the task
        print("   4. Deleting test task...")
        delete_response = requests.delete(f"{BASE_URL}/api/tasks/{task_id}", headers=headers)
        
        if delete_response.status_code == 204:
            print(f"      ✅ Task deleted successfully")
        else:
            print(f"      Status: {delete_response.status_code}")
    else:
        print(f"      ❌ Failed: {create_response.text}")

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🧪 Backend Integration Tests")
    print("="*60 + "\n")
    
    try:
        # Test 1: Health check
        test_health()
        
        # Test 2: Authentication
        token = test_auth_flow()
        
        if not token:
            print("\n❌ Cannot proceed without authentication token")
            return
        
        print()
        
        # Test 3: Tasks API
        test_tasks_api(token)
        
        print("\n" + "="*60)
        print("✅ All tests completed successfully!")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
