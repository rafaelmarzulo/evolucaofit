"""
Goal service - handles user fitness goals logic.
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import date, datetime

from ...database.models import Goal, User, BodyMeasurement
from ..schemas.goal import GoalCreate, GoalUpdate


class GoalService:
    """Goal service."""

    @staticmethod
    def create_goal(
        db: Session,
        user: User,
        goal_data: GoalCreate
    ) -> Goal:
        """
        Create a new goal.

        Args:
            db: Database session
            user: Current user
            goal_data: Goal data

        Returns:
            Created goal
        """
        goal = Goal(
            user_id=user.id,
            **goal_data.model_dump()
        )

        db.add(goal)
        db.commit()
        db.refresh(goal)

        return goal

    @staticmethod
    def get_user_goals(
        db: Session,
        user_id: int,
        goal_type: Optional[str] = None,
        is_active: Optional[bool] = None,
        is_completed: Optional[bool] = None,
        limit: int = 100
    ) -> List[Goal]:
        """
        Get user goals with optional filtering.

        Args:
            db: Database session
            user_id: User ID
            goal_type: Optional goal type filter
            is_active: Optional active status filter
            is_completed: Optional completed status filter
            limit: Maximum number of results

        Returns:
            List of goals
        """
        query = db.query(Goal).filter(Goal.user_id == user_id)

        if goal_type:
            query = query.filter(Goal.goal_type == goal_type)
        if is_active is not None:
            query = query.filter(Goal.is_active == is_active)
        if is_completed is not None:
            query = query.filter(Goal.is_completed == is_completed)

        goals = query.order_by(
            Goal.created_at.desc()
        ).limit(limit).all()

        return goals

    @staticmethod
    def get_goal_by_id(
        db: Session,
        goal_id: int,
        user_id: int
    ) -> Goal:
        """
        Get specific goal by ID.

        Args:
            db: Database session
            goal_id: Goal ID
            user_id: User ID (for authorization)

        Returns:
            Goal

        Raises:
            HTTPException: If not found or unauthorized
        """
        goal = db.query(Goal).filter(
            Goal.id == goal_id,
            Goal.user_id == user_id
        ).first()

        if not goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found"
            )

        return goal

    @staticmethod
    def update_goal(
        db: Session,
        goal_id: int,
        user_id: int,
        goal_data: GoalUpdate
    ) -> Goal:
        """Update goal."""
        goal = GoalService.get_goal_by_id(db, goal_id, user_id)

        update_data = goal_data.model_dump(exclude_unset=True)

        # If marking as completed, set completion date
        if update_data.get('is_completed') and not goal.is_completed:
            update_data['completed_date'] = date.today()

        for field, value in update_data.items():
            setattr(goal, field, value)

        db.commit()
        db.refresh(goal)

        return goal

    @staticmethod
    def delete_goal(db: Session, goal_id: int, user_id: int) -> None:
        """Delete goal."""
        goal = GoalService.get_goal_by_id(db, goal_id, user_id)

        db.delete(goal)
        db.commit()

    @staticmethod
    def calculate_progress(db: Session, goal: Goal) -> float:
        """
        Calculate goal progress based on current measurements.

        Args:
            db: Database session
            goal: Goal object

        Returns:
            Progress percentage (0-100)
        """
        # Get latest measurement
        latest_measurement = db.query(BodyMeasurement).filter(
            BodyMeasurement.user_id == goal.user_id
        ).order_by(BodyMeasurement.measurement_date.desc()).first()

        if not latest_measurement:
            return 0.0

        # Get starting measurement (closest to goal start date)
        start_measurement = db.query(BodyMeasurement).filter(
            BodyMeasurement.user_id == goal.user_id,
            BodyMeasurement.measurement_date <= goal.start_date
        ).order_by(BodyMeasurement.measurement_date.desc()).first()

        if not start_measurement:
            return 0.0

        # Calculate progress based on goal type
        if goal.target_weight_kg and start_measurement.weight_kg and latest_measurement.weight_kg:
            start_weight = start_measurement.weight_kg
            current_weight = latest_measurement.weight_kg
            target_weight = goal.target_weight_kg

            total_change_needed = target_weight - start_weight
            current_change = current_weight - start_weight

            if total_change_needed == 0:
                return 100.0

            progress = (current_change / total_change_needed) * 100
            return max(0.0, min(100.0, progress))  # Clamp between 0-100

        if goal.target_body_fat_percentage and start_measurement.body_fat_percentage and latest_measurement.body_fat_percentage:
            start_bf = start_measurement.body_fat_percentage
            current_bf = latest_measurement.body_fat_percentage
            target_bf = goal.target_body_fat_percentage

            total_change_needed = target_bf - start_bf
            current_change = current_bf - start_bf

            if total_change_needed == 0:
                return 100.0

            progress = (current_change / total_change_needed) * 100
            return max(0.0, min(100.0, progress))

        if goal.target_muscle_mass_kg and start_measurement.muscle_mass_kg and latest_measurement.muscle_mass_kg:
            start_mm = start_measurement.muscle_mass_kg
            current_mm = latest_measurement.muscle_mass_kg
            target_mm = goal.target_muscle_mass_kg

            total_change_needed = target_mm - start_mm
            current_change = current_mm - start_mm

            if total_change_needed == 0:
                return 100.0

            progress = (current_change / total_change_needed) * 100
            return max(0.0, min(100.0, progress))

        return 0.0

    @staticmethod
    def update_goal_progress(db: Session, goal_id: int, user_id: int) -> Goal:
        """
        Update goal progress automatically based on measurements.

        Args:
            db: Database session
            goal_id: Goal ID
            user_id: User ID

        Returns:
            Updated goal
        """
        goal = GoalService.get_goal_by_id(db, goal_id, user_id)

        progress = GoalService.calculate_progress(db, goal)
        goal.current_progress = round(progress, 2)

        # Auto-complete if progress reaches 100%
        if progress >= 100.0 and not goal.is_completed:
            goal.is_completed = True
            goal.completed_date = date.today()

        db.commit()
        db.refresh(goal)

        return goal
