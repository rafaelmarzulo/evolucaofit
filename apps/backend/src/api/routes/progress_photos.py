"""
Progress Photo routes.
"""
from fastapi import APIRouter, Depends, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from ...core.database import get_db
from ...core.dependencies import get_current_active_user
from ...database.models import User
from ..schemas.progress_photo import (
    ProgressPhotoCreate,
    ProgressPhotoResponse
)
from ..services.progress_photo_service import ProgressPhotoService

router = APIRouter(prefix="/progress-photos", tags=["Progress Photos"])


@router.post("/", response_model=ProgressPhotoResponse, status_code=201)
async def upload_progress_photo(
    file: UploadFile = File(...),
    photo_date: date = Form(...),
    photo_type: str = Form(..., regex="^(front|back|side|other)$"),
    weight_at_photo_kg: Optional[int] = Form(None),
    notes: Optional[str] = Form(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Upload a progress photo.

    Requires authentication.
    Accepts multipart/form-data with photo file and metadata.
    """
    photo_data = ProgressPhotoCreate(
        photo_date=photo_date,
        photo_type=photo_type,
        weight_at_photo_kg=weight_at_photo_kg,
        notes=notes
    )

    photo = await ProgressPhotoService.create_progress_photo(
        db, current_user, photo_data, file
    )
    return photo


@router.get("/", response_model=List[ProgressPhotoResponse])
async def get_progress_photos(
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    photo_type: Optional[str] = Query(None, description="Filter by photo type (front, back, side, other)"),
    limit: int = Query(100, ge=1, le=500, description="Maximum results"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's progress photos.

    Supports date and type filtering with pagination.
    """
    photos = ProgressPhotoService.get_user_photos(
        db, current_user.id, start_date, end_date, photo_type, limit
    )
    return photos


@router.get("/comparison", response_model=dict)
async def get_comparison_photos(
    start_date: date = Query(..., description="Start date for comparison"),
    end_date: date = Query(..., description="End date for comparison"),
    photo_type: str = Query(..., description="Photo type (front, back, side, other)"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get before/after comparison photos.

    Returns the earliest photo from start_date and latest photo before end_date.
    """
    comparison = ProgressPhotoService.get_comparison_photos(
        db, current_user.id, start_date, end_date, photo_type
    )
    return comparison


@router.get("/{photo_id}", response_model=ProgressPhotoResponse)
async def get_progress_photo(
    photo_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific progress photo by ID."""
    photo = ProgressPhotoService.get_photo_by_id(db, photo_id, current_user.id)
    return photo


@router.delete("/{photo_id}", status_code=204)
async def delete_progress_photo(
    photo_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete progress photo."""
    await ProgressPhotoService.delete_photo(db, photo_id, current_user.id)
    return None
