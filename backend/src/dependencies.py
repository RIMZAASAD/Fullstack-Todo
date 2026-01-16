from sqlmodel import Session, create_engine
from contextlib import contextmanager
import os
from fastapi import Depends
from .auth.middleware import get_current_user

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///../todo_app.db")

# Create the database engine
engine = create_engine(DATABASE_URL)


def get_session():
    """
    Get database session dependency
    """
    with Session(engine) as session:
        yield session


# JWT authentication dependency
def get_current_user_id(user_id: str = Depends(get_current_user)) -> str:
    """
    Get current user ID from JWT token
    """
    return user_id