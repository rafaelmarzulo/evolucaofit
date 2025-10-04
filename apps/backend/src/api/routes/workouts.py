"""
Workout routes.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from ...core.database import get_db
from ...core.dependencies import get_current_active_user
from ...database.models import User
from ..schemas.workout import (
    WorkoutCreate,
    WorkoutUpdate,
    WorkoutResponse
)
from ..services.workout_service import WorkoutService

router = APIRouter(prefix="/workouts", tags=["Workouts"])


@router.post("/", response_model=WorkoutResponse, status_code=201)
async def create_workout(
    workout_data: WorkoutCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new workout with exercises.

    Requires authentication.
    """
    workout = WorkoutService.create_workout(db, current_user, workout_data)
    return workout


@router.get("/", response_model=List[WorkoutResponse])
async def get_workouts(
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    workout_type: Optional[str] = Query(None, description="Filter by workout type"),
    limit: int = Query(100, ge=1, le=500, description="Maximum results"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's workouts.

    Supports date and type filtering with pagination.
    """
    workouts = WorkoutService.get_user_workouts(
        db, current_user.id, start_date, end_date, workout_type, limit
    )
    return workouts


@router.get("/stats", response_model=dict)
async def get_workout_stats(
    start_date: date = Query(..., description="Start date for stats"),
    end_date: date = Query(..., description="End date for stats"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get workout statistics for a period."""
    stats = WorkoutService.get_workout_stats(db, current_user.id, start_date, end_date)
    return stats


@router.get("/{workout_id}", response_model=WorkoutResponse)
async def get_workout(
    workout_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific workout by ID."""
    workout = WorkoutService.get_workout_by_id(db, workout_id, current_user.id)
    return workout


@router.put("/{workout_id}", response_model=WorkoutResponse)
async def update_workout(
    workout_id: int,
    workout_data: WorkoutUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update workout."""
    workout = WorkoutService.update_workout(
        db, workout_id, current_user.id, workout_data
    )
    return workout


@router.delete("/{workout_id}", status_code=204)
async def delete_workout(
    workout_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete workout."""
    WorkoutService.delete_workout(db, workout_id, current_user.id)
    return None
