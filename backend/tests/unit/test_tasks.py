import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

import pytest
from unittest.mock import Mock, MagicMock
from sqlmodel import Session
from datetime import datetime
from src.models.task import Task, TaskCreate, TaskUpdate, TaskRead
from src.services.task_service import TaskService


def test_create_task():
    """
    Test creating a new task
    """
    # Arrange
    mock_session = Mock(spec=Session)
    mock_session.add = Mock()
    mock_session.commit = Mock()
    mock_session.refresh = Mock()

    task_service = TaskService()
    task_data = TaskCreate(
        title="Test Task",
        description="Test Description",
        completed=False,
        user_id="user123"
    )

    # Act
    result = task_service.create_task(mock_session, task_data, "user123")

    # Assert
    assert isinstance(result, TaskRead)
    assert result.title == "Test Task"
    assert result.description == "Test Description"
    assert result.completed is False
    assert result.user_id == "user123"
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()


def test_get_tasks_by_user():
    """
    Test getting all tasks for a user
    """
    # Arrange
    mock_session = Mock(spec=Session)
    mock_exec_result = Mock()
    mock_exec_result.all = Mock(return_value=[
        Task(
            id="task1",
            title="Task 1",
            description="Description 1",
            completed=False,
            user_id="user123",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    ])
    mock_session.exec = Mock(return_value=mock_exec_result)

    task_service = TaskService()

    # Act
    result = task_service.get_tasks_by_user(mock_session, "user123")

    # Assert
    assert len(result) == 1
    assert isinstance(result[0], TaskRead)
    assert result[0].title == "Task 1"


def test_update_task():
    """
    Test updating a task
    """
    # Arrange
    mock_session = Mock(spec=Session)
    existing_task = Task(
        id="task1",
        title="Old Title",
        description="Old Description",
        completed=False,
        user_id="user123",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    mock_exec_result = Mock()
    mock_exec_result.first = Mock(return_value=existing_task)
    mock_session.exec = Mock(return_value=mock_exec_result)

    task_service = TaskService()
    update_data = TaskUpdate(title="New Title")

    # Act
    result = task_service.update_task(mock_session, "task1", "user123", update_data)

    # Assert
    assert result is not None
    assert result.title == "New Title"
    mock_session.commit.assert_called_once()


def test_toggle_completion():
    """
    Test toggling task completion status
    """
    # Arrange
    mock_session = Mock(spec=Session)
    existing_task = Task(
        id="task1",
        title="Task 1",
        description="Description 1",
        completed=False,
        user_id="user123",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    mock_exec_result = Mock()
    mock_exec_result.first = Mock(return_value=existing_task)
    mock_session.exec = Mock(return_value=mock_exec_result)

    task_service = TaskService()

    # Act
    result = task_service.toggle_completion(mock_session, "task1", "user123")

    # Assert
    assert result is not None
    assert result.completed is True  # Was False, now True


def test_delete_task():
    """
    Test deleting a task
    """
    # Arrange
    mock_session = Mock(spec=Session)
    existing_task = Task(
        id="task1",
        title="Task 1",
        description="Description 1",
        completed=False,
        user_id="user123",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    mock_exec_result = Mock()
    mock_exec_result.first = Mock(return_value=existing_task)
    mock_session.exec = Mock(return_value=mock_exec_result)
    mock_session.delete = Mock()

    task_service = TaskService()

    # Act
    result = task_service.delete_task(mock_session, "task1", "user123")

    # Assert
    assert result is True
    mock_session.delete.assert_called_once()