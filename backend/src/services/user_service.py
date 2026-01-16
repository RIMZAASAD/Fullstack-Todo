from sqlmodel import Session, select
from datetime import datetime
from typing import Optional
from ..models.user import User, UserCreate, UserRead, UserLogin, UserUpdate
from fastapi import HTTPException, status


class UserService:
    """
    UserService provides business logic for managing users
    """

    def create_user(self, db_session: Session, user_data: UserCreate) -> UserRead:
        """
        Create a new user
        """
        # Check if user with email already exists
        existing_user = self.get_user_by_email(db_session, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email already exists"
            )

        # Hash the password
        hashed_password = user_data.hash_password()

        user = User(
            email=user_data.email,
            name=user_data.name,
            hashed_password=hashed_password
        )

        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        # Create UserRead response object
        return UserRead(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at,
            updated_at=user.updated_at,
            is_active=user.is_active
        )

    def update_password(self, db_session: Session, user: User, new_password: str) -> User:
        """
        Update user password
        """
        import bcrypt
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user.hashed_password = hashed_password
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    def get_user_by_id(self, db_session: Session, user_id: str) -> Optional[User]:
        """
        Get a user by ID
        """
        statement = select(User).where(User.id == user_id)
        user = db_session.exec(statement).first()
        return user

    def get_user_by_email(self, db_session: Session, email: str) -> Optional[User]:
        """
        Get a user by email
        """
        statement = select(User).where(User.email == email)
        user = db_session.exec(statement).first()
        return user

    def authenticate_user(self, db_session: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user by email and password
        """
        user = self.get_user_by_email(db_session, email)
        if not user or not user.verify_password(password):
            return None
        return user

    
    def update_user_profile(self, db_session: Session, user: User, update_data: UserUpdate) -> UserRead:
        """
        Update user profile information
        """
        if update_data.name is not None:
            user.name = update_data.name
        
        if update_data.email is not None and update_data.email != user.email:
            # Check if new email is already taken
            existing_user = self.get_user_by_email(db_session, update_data.email)
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            user.email = update_data.email
            
        user.updated_at = datetime.now()
        
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        
        return UserRead(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at,
            updated_at=user.updated_at,
            is_active=user.is_active
        )

    def get_user_public_info(self, db_session: Session, user_id: str) -> Optional[UserRead]:
        """
        Get public information about a user
        """
        user = self.get_user_by_id(db_session, user_id)
        if not user:
            return None

        return UserRead(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at,
            updated_at=user.updated_at,
            is_active=user.is_active
        )