"""
Authentication routes.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...core.database import get_db
from ..schemas.user import UserCreate, UserLogin, UserResponse, Token
from ..services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user.

    - **email**: Valid email address
    - **full_name**: User's full name
    - **password**: Strong password (min 8 characters)
    """
    user = AuthService.register_user(db, user_data)
    return user


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login and receive JWT tokens.

    - **email**: Registered email
    - **password**: User password

    Returns access_token and refresh_token
    """
    tokens = AuthService.authenticate_user(db, credentials)
    return tokens


@router.post("/logout")
async def logout():
    """
    Logout user (client should discard tokens).
    """
    return {"message": "Successfully logged out"}
