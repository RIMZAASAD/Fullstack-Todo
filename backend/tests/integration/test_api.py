import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

# Set a test secret key for testing (must be set before importing any app modules)
os.environ["BETTER_AUTH_SECRET"] = "test_secret_key_for_testing"

import pytest
from fastapi.testclient import TestClient
from src.main import app
from sqlmodel import create_engine, Session
from src.models.task import Task, TaskCreate
from src.main import engine as original_engine
from jose import jwt
from datetime import datetime, timedelta, timezone


# Use an in-memory database for testing
TEST_DATABASE_URL = "sqlite:///./test.db"
test_engine = create_engine(TEST_DATABASE_URL)


@pytest.fixture
def client():
    """
    Create a test client with a clean database for each test
    """
    with TestClient(app) as c:
        yield c


def create_token(user_id: str):
    """
    Helper to create a JWT token for testing
    """
    from src.auth.jwt import SECRET_KEY, ALGORITHM
    expire = datetime.now(timezone.utc) + timedelta(hours=1)
    to_encode = {"user_id": user_id, "exp": expire.timestamp()}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def test_create_task_endpoint(client):
    """
    Test creating a task via the API endpoint
    """
    token = create_token("user123")
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False
    }

    response = client.post(
        "/api/tasks", 
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201

    data = response.json()
    assert data["title"] == "Test Task"
    assert data["description"] == "Test Description"
    assert data["completed"] is False
    assert data["user_id"] == "user123"


def test_get_tasks_endpoint(client):
    """
    Test getting all tasks for a user via the API endpoint
    """
    token = create_token("user456")
    # First create a task
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
    response = client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200

    data = response.json()
    assert len(data) >= 1
    assert any(task["title"] == "Another Test Task" for task in data)


def test_get_specific_task_endpoint(client):
    """
    Test getting a specific task via the API endpoint
    """
    token = create_token("user789")
    # First create a task to get
    task_data = {
        "title": "Specific Task",
        "description": "Specific Description",
        "completed": False
    }
    create_response = client.post(
        "/api/tasks", 
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Then get the specific task
    response = client.get(
        f"/api/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200

    data = response.json()
    assert data["title"] == "Specific Task"
    assert data["id"] == task_id


def test_update_task_endpoint(client):
    """
    Test updating a task via the API endpoint
    """
    token = create_token("user999")
    # First create a task to update
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


def test_toggle_completion_endpoint(client):
    """
    Test toggling task completion via the API endpoint
    """
    token = create_token("user888")
    # First create a task to toggle
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


def test_delete_task_endpoint(client):
    """
    Test deleting a task via the API endpoint
    """
    token = create_token("user777")
    # First create a task to delete
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


def test_health_endpoint(client):
    """
    Test the health check endpoint
    """
    response = client.get("/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "healthy"