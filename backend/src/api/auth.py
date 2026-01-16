from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from datetime import datetime, timedelta
import os
from ..models.user import UserCreate, UserLogin, UserPublic, UserUpdate
from ..services.user_service import UserService
from ..services.email_service import EmailService
from ..auth.jwt import create_access_token, create_reset_token, decode_token_payload
from ..dependencies import get_session
from ..dependencies import get_current_user_id
from pydantic import BaseModel, EmailStr

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


router = APIRouter()


@router.post("/auth/register", response_model=UserPublic, status_code=201)
def register_user(
    user_data: UserCreate,
    db_session: Session = Depends(get_session)
):
    """
    Register a new user
    """
    # Validate password strength
    if not user_data.validate_password_strength():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
        )

    service = UserService()
    return service.create_user(db_session, user_data)


@router.post("/auth/login")
def login_user(
    user_credentials: UserLogin,
    db_session: Session = Depends(get_session)
):
    """
    Login a user and return JWT token
    """
    service = UserService()
    user = service.authenticate_user(
        db_session,
        user_credentials.email,
        user_credentials.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user account",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT token with user ID
    access_token_expires = timedelta(minutes=30)  # Token expires in 30 minutes
    access_token = create_access_token(
        data={"user_id": user.id},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserPublic(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at,
            updated_at=user.updated_at,
            is_active=user.is_active
        )
    }


@router.post("/auth/logout")
def logout_user():
    """
    Logout a user (client-side token removal is sufficient)
    """
    return {"message": "Successfully logged out"}


@router.get("/auth/me", response_model=UserPublic)
def get_current_user(
    current_user_id: str = Depends(get_current_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Get current authenticated user's information
    """
    service = UserService()
    user = service.get_user_public_info(db_session, current_user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user


@router.put("/auth/me", response_model=UserPublic)
def update_current_user(
    user_update: UserUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db_session: Session = Depends(get_session)
):
    """
    Update current authenticated user's information
    """
    service = UserService()
    user = service.get_user_by_id(db_session, current_user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return service.update_user_profile(db_session, user, user_update)


@router.post("/auth/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db_session: Session = Depends(get_session)
):
    """
    Send password reset email
    """
    try:
        user_service = UserService()
        user = user_service.get_user_by_email(db_session, request.email)
        
        if user:
            reset_token = create_reset_token(user.email)
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
            reset_link = f"{frontend_url}/reset-password?token={reset_token}"
            
            email_service = EmailService()
            await email_service.send_reset_password_email(request.email, reset_link)
            
    except Exception as e:
        # Log error to console for server monitoring, but keep response generic
        print(f"ERROR: Password reset flow failed for {request.email}: {e}")
    
    return {"message": "If an account with that email exists, we have sent a password reset link."}


@router.post("/auth/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db_session: Session = Depends(get_session)
):
    """
    Reset password using token
    """
    # Validate password strength
    temp_user_data = UserCreate(email="temp@example.com", password=request.new_password, name="temp")
    if not temp_user_data.validate_password_strength():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
        )

    # Verify token
    payload = decode_token_payload(request.token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    if payload.get("type") != "reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token type"
        )

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token payload"
        )

    user_service = UserService()
    user = user_service.get_user_by_email(db_session, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user_service.update_password(db_session, user, request.new_password)

    return {"message": "Password successfully reset"}