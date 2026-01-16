from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class TaskWithUserIdBase(TaskBase):
    user_id: str = Field(min_length=1)

class Task(TaskWithUserIdBase, table=True):
    """
    Task model representing a user's task with all required attributes for the todo application
    """
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class TaskRead(TaskWithUserIdBase):
    """
    Task response model without internal fields
    """
    id: str
    created_at: datetime
    updated_at: datetime

class TaskCreate(TaskBase):
    """
    Task creation model - same as base but with validation
    """
    pass

class TaskUpdate(SQLModel):
    """
    Task update model - all fields are optional for partial updates
    """
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None