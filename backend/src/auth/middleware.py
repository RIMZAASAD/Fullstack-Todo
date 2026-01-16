"""
JWT Authentication middleware and dependencies for FastAPI
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from .jwt import verify_token, get_user_id_from_token


# Initialize security scheme for Bearer token
security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Dependency to get current user from JWT token
    """
    token = credentials.credentials

    try:
        # Verify the token and get the payload
        payload = verify_token(token)

        # Extract user_id from token
        user_id = get_user_id_from_token(token)

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials - no user_id in token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user_id
    except HTTPException:
        # Re-raise HTTP exceptions (like invalid/expired tokens)
        raise
    except Exception:
        # Handle any other errors
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_user_owns_resource(user_id: str, resource_user_id: str):
    """
    Verify that the authenticated user owns the resource they're trying to access
    """
    if user_id != resource_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized to access this resource",
            headers={"WWW-Authenticate": "Bearer"},
        )