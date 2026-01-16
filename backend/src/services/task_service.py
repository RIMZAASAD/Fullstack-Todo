from sqlmodel import Session, select
from typing import List, Optional
from ..models.task import Task, TaskCreate, TaskUpdate, TaskRead
from datetime import datetime

class TaskService:
    """
    TaskService provides business logic for managing tasks with proper user isolation
    """

    def create_task(self, db_session: Session, task_data: TaskCreate, user_id: str) -> TaskRead:
        """
        Create a new task for a user
        """
        task = Task(
            title=task_data.title,
            description=task_data.description,
            completed=task_data.completed,
            user_id=user_id
        )
        task.updated_at = datetime.now()

        db_session.add(task)
        db_session.commit()
        db_session.refresh(task)

        # Create TaskRead response object
        return TaskRead(
            id=task.id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        )

    def get_tasks_by_user(self, db_session: Session, user_id: str) -> List[TaskRead]:
        """
        Get all tasks for a specific user
        """
        statement = select(Task).where(Task.user_id == user_id)
        tasks = db_session.exec(statement).all()

        return [
            TaskRead(
                id=task.id,
                title=task.title,
                description=task.description,
                completed=task.completed,
                user_id=task.user_id,
                created_at=task.created_at,
                updated_at=task.updated_at
            ) for task in tasks
        ]

    def get_task_by_id(self, db_session: Session, task_id: str, user_id: str) -> Optional[Task]:
        """
        Get a specific task by ID for a user
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = db_session.exec(statement).first()

        return task

    def update_task(self, db_session: Session, task_id: str, user_id: str, task_data: TaskUpdate) -> Optional[TaskRead]:
        """
        Update a task for a user
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = db_session.exec(statement).first()

        if not task:
            return None

        # Update only the fields that are provided
        for field, value in task_data.model_dump(exclude_unset=True).items():
            if hasattr(task, field):
                setattr(task, field, value)

        task.updated_at = datetime.now()

        db_session.add(task)
        db_session.commit()
        db_session.refresh(task)

        return TaskRead(
            id=task.id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        )

    def toggle_completion(self, db_session: Session, task_id: str, user_id: str) -> Optional[TaskRead]:
        """
        Toggle the completion status of a task
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = db_session.exec(statement).first()

        if not task:
            return None

        task.completed = not task.completed
        task.updated_at = datetime.now()

        db_session.add(task)
        db_session.commit()
        db_session.refresh(task)

        return TaskRead(
            id=task.id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        )

    def delete_task(self, db_session: Session, task_id: str, user_id: str) -> bool:
        """
        Delete a task for a user
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = db_session.exec(statement).first()

        if not task:
            return False

        db_session.delete(task)
        db_session.commit()

        return True