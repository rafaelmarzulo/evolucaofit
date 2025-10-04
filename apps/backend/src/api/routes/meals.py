"""
Meal routes.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from ...core.database import get_db
from ...core.dependencies import get_current_active_user
from ...database.models import User
from ..schemas.meal import (
    MealCreate,
    MealUpdate,
    MealResponse
)
from ..services.meal_service import MealService

router = APIRouter(prefix="/meals", tags=["Meals"])


@router.post("/", response_model=MealResponse, status_code=201)
async def create_meal(
    meal_data: MealCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new meal.

    Requires authentication.
    """
    meal = MealService.create_meal(db, current_user, meal_data)
    return meal


@router.get("/", response_model=List[MealResponse])
async def get_meals(
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    meal_type: Optional[str] = Query(None, description="Filter by meal type (breakfast, lunch, dinner, snack)"),
    limit: int = Query(100, ge=1, le=500, description="Maximum results"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's meals.

    Supports date and type filtering with pagination.
    """
    meals = MealService.get_user_meals(
        db, current_user.id, start_date, end_date, meal_type, limit
    )
    return meals


@router.get("/daily/{target_date}", response_model=dict)
async def get_daily_nutrition(
    target_date: date,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get daily nutrition summary for a specific date."""
    summary = MealService.get_daily_nutrition(db, current_user.id, target_date)
    return summary


@router.get("/stats", response_model=dict)
async def get_nutrition_stats(
    start_date: date = Query(..., description="Start date for stats"),
    end_date: date = Query(..., description="End date for stats"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get nutrition statistics for a period."""
    stats = MealService.get_nutrition_stats(db, current_user.id, start_date, end_date)
    return stats


@router.get("/{meal_id}", response_model=MealResponse)
async def get_meal(
    meal_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific meal by ID."""
    meal = MealService.get_meal_by_id(db, meal_id, current_user.id)
    return meal


@router.put("/{meal_id}", response_model=MealResponse)
async def update_meal(
    meal_id: int,
    meal_data: MealUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update meal."""
    meal = MealService.update_meal(db, meal_id, current_user.id, meal_data)
    return meal


@router.delete("/{meal_id}", status_code=204)
async def delete_meal(
    meal_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete meal."""
    MealService.delete_meal(db, meal_id, current_user.id)
    return None
