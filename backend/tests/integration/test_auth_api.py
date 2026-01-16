import sys
import os
# Add the project root to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

# Set a test secret key for testing (must be set before importing any app modules)
os.environ["BETTER_AUTH_SECRET"] = "test_secret_key_for_testing"

import pytest
from fastapi.testclient import TestClient
from jose import jwt
from src.main import app
from src.dependencies import engine
from sqlmodel import create_engine, Session
from sqlalchemy.pool import StaticPool
from datetime import datetime, timedelta, timezone


# Use an in-memory database for testing
TEST_DATABASE_URL = "sqlite:///./test_auth.db"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


@pytest.fixture
def client():
    """
    Create a test client with a clean database for each test
    """
    with TestClient(app) as c:
        yield c


def create_test_token(user_id: str = "test_user_123"):
    """
    Helper function to create a valid JWT token for testing
    """
    from src.auth.jwt import SECRET_KEY, ALGORITHM

    expire = datetime.now(timezone.utc) + timedelta(hours=1)
    to_encode = {"user_id": user_id, "exp": expire.timestamp()}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def test_create_task_with_valid_token(client):
    """
    Test creating a task with a valid JWT token
    """
    token = create_test_token()
    task_data = {
        "title": "Test Task with Auth",
        "description": "Test Description with Auth",
        "completed": False
    }

    response = client.post(
        "/api/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201

    data = response.json()
    assert data["title"] == "Test Task with Auth"
    assert data["description"] == "Test Description with Auth"
    assert data["completed"] is False
    assert data["user_id"] == "test_user_123"


def test_create_task_without_token(client):
    """
    Test creating a task without a JWT token (should fail)
    """
    task_data = {
        "title": "Test Task without Auth",
        "description": "Test Description without Auth",
        "completed": False
    }

    response = client.post("/api/tasks", json=task_data)
    assert response.status_code == 403  # Forbidden (FastAPI default for missing Bearer)


def test_create_task_with_invalid_token(client):
    """
    Test creating a task with an invalid JWT token (should fail)
    """
    task_data = {
        "title": "Test Task with Invalid Token",
        "description": "Test Description with Invalid Token",
        "completed": False
    }

    response = client.post(
        "/api/tasks",
        json=task_data,
        headers={"Authorization": "Bearer invalid_token_here"}
    )
    assert response.status_code == 401  # Unauthorized


def test_get_tasks_with_valid_token(client):
    """
    Test getting tasks with a valid JWT token
    """
    # First create a task with a valid token
    token = create_test_token()
    task_data = {
        "title": "Another Test Task",
        "description": "Another Test Description",
        "completed": False
    }
    client.post(
        "/api/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    # Then get tasks for that user
    response = client.get("/api/tasks", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    data = response.json()
    assert len(data) >= 1
    assert any(task["title"] == "Another Test Task" for task in data)


def test_get_tasks_without_token(client):
    """
    Test getting tasks without a JWT token (should fail)
    """
    response = client.get("/api/tasks")
    assert response.status_code == 403  # Forbidden


def test_update_task_with_valid_token(client):
    """
    Test updating a task with a valid JWT token
    """
    # First create a task to update
    token = create_test_token()
    task_data = {
        "title": "Original Task",
        "description": "Original Description",
        "completed": False
    }
    create_response = client.post(
        "/api/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Then update the task
    update_data = {
        "title": "Updated Task",
        "description": "Updated Description",
        "completed": True
    }
    response = client.put(
        f"/api/tasks/{task_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200

    data = response.json()
    assert data["title"] == "Updated Task"
    assert data["completed"] is True


def test_update_task_without_token(client):
    """
    Test updating a task without a JWT token (should fail)
    """
    # First create a task
    token = create_test_token()
    task_data = {
        "title": "Protected Task",
        "description": "Protected Description",
        "completed": False
    }
    create_response = client.post(
        "/api/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Then try to update without token
    update_data = {
        "title": "Should Not Update",
        "description": "Should Not Update Description",
        "completed": True
    }
    response = client.put(f"/api/tasks/{task_id}", json=update_data)
    assert response.status_code == 403  # Forbidden


def test_toggle_completion_with_valid_token(client):
    """
    Test toggling task completion with a valid JWT token
    """
    # First create a task to toggle
    token = create_test_token()
    task_data = {
        "title": "Toggle Task",
        "description": "Toggle Description",
        "completed": False
    }
    create_response = client.post(
        "/api/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Then toggle the task completion
    response = client.patch(
        f"/api/tasks/{task_id}/complete",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200

    data = response.json()
    assert data["completed"] is True  # Should be True after toggling from False


def test_toggle_completion_without_token(client):
    """
    Test toggling task completion without a JWT token (should fail)
    """
    # First create a task
    token = create_test_token()
    task_data = {
        "title": "Protected Toggle Task",
        "description": "Protected Toggle Description",
        "completed": False
    }
    create_response = client.post(
        "/api/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Then try to toggle without token
    response = client.patch(f"/api/tasks/{task_id}/complete")
    assert response.status_code == 403  # Forbidden


def test_delete_task_with_valid_token(client):
    """
    Test deleting a task with a valid JWT token
    """
    # First create a task to delete
    token = create_test_token()
    task_data = {
        "title": "Delete Task",
        "description": "Delete Description",
        "completed": False
    }
    create_response = client.post(
        "/api/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Then delete the task
    response = client.delete(
        f"/api/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 204


def test_delete_task_without_token(client):
    """
    Test deleting a task without a JWT token (should fail)
    """
    # First create a task
    token = create_test_token()
    task_data = {
        "title": "Protected Delete Task",
        "description": "Protected Delete Description",
        "completed": False
    }
    create_response = client.post(
        "/api/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Then try to delete without token
    response = client.delete(f"/api/tasks/{task_id}")
    assert response.status_code == 403  # Forbidden


def test_expired_token(client):
    """
    Test using an expired JWT token (should fail)
    """
    from src.auth.jwt import SECRET_KEY, ALGORITHM

    # Create an expired token
    expire = datetime.now(timezone.utc) - timedelta(minutes=1)  # Expired 1 minute ago
    to_encode = {"user_id": "test_user_123", "exp": expire.timestamp()}
    expired_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    task_data = {
        "title": "Test with Expired Token",
        "description": "Test Description with Expired Token",
        "completed": False
    }

    response = client.post(
        "/api/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    assert response.status_code == 401  # Unauthorized