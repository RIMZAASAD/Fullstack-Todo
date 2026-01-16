from fastapi import APIRouter, Depends, HTTPException, Path
from sqlmodel import Session
from typing import List
from ..models.task import TaskCreate, TaskRead, TaskUpdate
from ..services.task_service import TaskService
from ..dependencies import get_session, get_current_user_id

router = APIRouter()

@router.post("/tasks", response_model=TaskRead, status_code=201)
def create_task(
    task_data: TaskCreate,
    current_user_id: str = Depends(get_current_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user
    """
    service = TaskService()
    return service.create_task(db_session, task_data, current_user_id)


@router.get("/tasks", response_model=List[TaskRead])
def get_tasks(
    current_user_id: str = Depends(get_current_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Get all tasks for the authenticated user
    """
    service = TaskService()
    return service.get_tasks_by_user(db_session, current_user_id)


@router.get("/tasks/{task_id}", response_model=TaskRead)
def get_task(
    task_id: str = Path(..., description="The ID of the task"),
    current_user_id: str = Depends(get_current_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Get a specific task by ID for the authenticated user
    """
    service = TaskService()
    task = service.get_task_by_id(db_session, task_id, current_user_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@router.put("/tasks/{task_id}", response_model=TaskRead)
def update_task(
    task_id: str = Path(..., description="The ID of the task"),
    task_data: TaskUpdate = None,
    current_user_id: str = Depends(get_current_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Update a task for the authenticated user
    """
    service = TaskService()
    updated_task = service.update_task(db_session, task_id, current_user_id, task_data)

    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")

    return updated_task


@router.patch("/tasks/{task_id}/complete", response_model=TaskRead)
def toggle_completion(
    task_id: str = Path(..., description="The ID of the task"),
    current_user_id: str = Depends(get_current_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a task for the authenticated user
    """
    service = TaskService()
    updated_task = service.toggle_completion(db_session, task_id, current_user_id)

    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")

    return updated_task


@router.delete("/tasks/{task_id}", status_code=204)
def delete_task(
    task_id: str = Path(..., description="The ID of the task"),
    current_user_id: str = Depends(get_current_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Delete a task for the authenticated user
    """
    service = TaskService()
    success = service.delete_task(db_session, task_id, current_user_id)

    if not success:
        raise HTTPException(status_code=404, detail="Task not found")

    return