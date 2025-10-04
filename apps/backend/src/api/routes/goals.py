"""
Goal routes.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ...core.database import get_db
from ...core.dependencies import get_current_active_user
from ...database.models import User
from ..schemas.goal import (
    GoalCreate,
    GoalUpdate,
    GoalResponse
)
from ..services.goal_service import GoalService

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.post("/", response_model=GoalResponse, status_code=201)
async def create_goal(
    goal_data: GoalCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new fitness goal.

    Requires authentication.
    """
    goal = GoalService.create_goal(db, current_user, goal_data)
    return goal


@router.get("/", response_model=List[GoalResponse])
async def get_goals(
    goal_type: Optional[str] = Query(None, description="Filter by goal type"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    is_completed: Optional[bool] = Query(None, description="Filter by completion status"),
    limit: int = Query(100, ge=1, le=500, description="Maximum results"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's goals.

    Supports filtering by type, active and completion status.
    """
    goals = GoalService.get_user_goals(
        db, current_user.id, goal_type, is_active, is_completed, limit
    )
    return goals


@router.get("/{goal_id}", response_model=GoalResponse)
async def get_goal(
    goal_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific goal by ID."""
    goal = GoalService.get_goal_by_id(db, goal_id, current_user.id)
    return goal


@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: int,
    goal_data: GoalUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update goal."""
    goal = GoalService.update_goal(db, goal_id, current_user.id, goal_data)
    return goal


@router.post("/{goal_id}/update-progress", response_model=GoalResponse)
async def update_goal_progress(
    goal_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update goal progress automatically based on measurements.

    Calculates progress by comparing current measurements with goal targets.
    """
    goal = GoalService.update_goal_progress(db, goal_id, current_user.id)
    return goal


@router.delete("/{goal_id}", status_code=204)
async def delete_goal(
    goal_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete goal."""
    GoalService.delete_goal(db, goal_id, current_user.id)
    return None
