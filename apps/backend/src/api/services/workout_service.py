"""
Workout service - handles workout and exercise logic.
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import date

from ...database.models import Workout, Exercise, User
from ..schemas.workout import WorkoutCreate, WorkoutUpdate


class WorkoutService:
    """Workout service."""

    @staticmethod
    def create_workout(
        db: Session,
        user: User,
        workout_data: WorkoutCreate
    ) -> Workout:
        """
        Create a new workout with exercises.

        Args:
            db: Database session
            user: Current user
            workout_data: Workout data

        Returns:
            Created workout
        """
        # Extract exercises data
        exercises_data = workout_data.exercises
        workout_dict = workout_data.model_dump(exclude={'exercises'})

        # Create workout
        workout = Workout(
            user_id=user.id,
            **workout_dict
        )

        db.add(workout)
        db.flush()  # Get workout ID before creating exercises

        # Create exercises
        for exercise_data in exercises_data:
            exercise = Exercise(
                workout_id=workout.id,
                **exercise_data.model_dump()
            )
            db.add(exercise)

        db.commit()
        db.refresh(workout)

        return workout

    @staticmethod
    def get_user_workouts(
        db: Session,
        user_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        workout_type: Optional[str] = None,
        limit: int = 100
    ) -> List[Workout]:
        """
        Get user workouts with optional filtering.

        Args:
            db: Database session
            user_id: User ID
            start_date: Optional start date filter
            end_date: Optional end date filter
            workout_type: Optional workout type filter
            limit: Maximum number of results

        Returns:
            List of workouts
        """
        query = db.query(Workout).filter(Workout.user_id == user_id)

        if start_date:
            query = query.filter(Workout.workout_date >= start_date)
        if end_date:
            query = query.filter(Workout.workout_date <= end_date)
        if workout_type:
            query = query.filter(Workout.workout_type == workout_type)

        workouts = query.order_by(
            Workout.workout_date.desc()
        ).limit(limit).all()

        return workouts

    @staticmethod
    def get_workout_by_id(
        db: Session,
        workout_id: int,
        user_id: int
    ) -> Workout:
        """
        Get specific workout by ID.

        Args:
            db: Database session
            workout_id: Workout ID
            user_id: User ID (for authorization)

        Returns:
            Workout

        Raises:
            HTTPException: If not found or unauthorized
        """
        workout = db.query(Workout).filter(
            Workout.id == workout_id,
            Workout.user_id == user_id
        ).first()

        if not workout:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workout not found"
            )

        return workout

    @staticmethod
    def update_workout(
        db: Session,
        workout_id: int,
        user_id: int,
        workout_data: WorkoutUpdate
    ) -> Workout:
        """Update workout."""
        workout = WorkoutService.get_workout_by_id(db, workout_id, user_id)

        update_data = workout_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(workout, field, value)

        db.commit()
        db.refresh(workout)

        return workout

    @staticmethod
    def delete_workout(db: Session, workout_id: int, user_id: int) -> None:
        """Delete workout (cascade deletes exercises)."""
        workout = WorkoutService.get_workout_by_id(db, workout_id, user_id)

        db.delete(workout)
        db.commit()

    @staticmethod
    def get_workout_stats(db: Session, user_id: int, start_date: date, end_date: date) -> dict:
        """
        Get workout statistics for a period.

        Args:
            db: Database session
            user_id: User ID
            start_date: Start date
            end_date: End date

        Returns:
            Statistics dict
        """
        workouts = WorkoutService.get_user_workouts(
            db, user_id, start_date=start_date, end_date=end_date, limit=1000
        )

        total_workouts = len(workouts)
        total_duration = sum(w.duration_minutes or 0 for w in workouts)
        total_calories = sum(w.calories_burned or 0 for w in workouts)

        workout_types = {}
        for workout in workouts:
            workout_types[workout.workout_type] = workout_types.get(workout.workout_type, 0) + 1

        return {
            "total_workouts": total_workouts,
            "total_duration_minutes": total_duration,
            "total_calories_burned": total_calories,
            "workout_types": workout_types,
            "average_duration": round(total_duration / total_workouts, 2) if total_workouts > 0 else 0
        }
