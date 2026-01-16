from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid
import bcrypt


class UserBase(SQLModel):
    email: str = Field(unique=True, min_length=1, max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)


class User(UserBase, table=True):
    """
    User model representing a user in the todo application
    """
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    hashed_password: str = Field(min_length=1)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    is_active: bool = Field(default=True)

    def verify_password(self, plain_password: str) -> bool:
        """
        Verify a plain password against the hashed password
        """
        return bcrypt.checkpw(plain_password.encode('utf-8'), self.hashed_password.encode('utf-8'))


class UserRead(UserBase):
    """
    User response model without sensitive fields
    """
    id: str
    created_at: datetime
    updated_at: datetime
    is_active: bool


class UserCreate(UserBase):
    """
    User creation model with password
    """
    password: str = Field(min_length=8, max_length=128)

    def validate_password_strength(self) -> bool:
        """
        Validate password strength based on security requirements
        At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        """
        password = self.password

        # Length check
        if len(password) < 8:
            return False

        # Character variety checks
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_special = any(c in "!@#$%^&*(),.?\":{}|<>" for c in password)

        # Check if all requirements are met
        return has_upper and has_lower and has_digit and has_special

    def hash_password(self) -> str:
        """
        Hash the password before storing
        """
        return bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


class UserUpdate(SQLModel):
    """
    User update model - all fields are optional for partial updates
    """
    name: Optional[str] = None
    email: Optional[str] = None


class UserLogin(SQLModel):
    """
    User login model
    """
    email: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=1, max_length=128)


class UserPublic(UserBase):
    """
    Public user model for responses that don't include sensitive data
    """
    id: str
    created_at: datetime
    updated_at: datetime
    is_active: bool