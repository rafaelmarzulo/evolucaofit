"""
Meal service - handles meal and nutrition logic.
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import date

from ...database.models import Meal, User
from ..schemas.meal import MealCreate, MealUpdate


class MealService:
    """Meal service."""

    @staticmethod
    def create_meal(
        db: Session,
        user: User,
        meal_data: MealCreate
    ) -> Meal:
        """
        Create a new meal.

        Args:
            db: Database session
            user: Current user
            meal_data: Meal data

        Returns:
            Created meal
        """
        meal = Meal(
            user_id=user.id,
            **meal_data.model_dump()
        )

        db.add(meal)
        db.commit()
        db.refresh(meal)

        return meal

    @staticmethod
    def get_user_meals(
        db: Session,
        user_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        meal_type: Optional[str] = None,
        limit: int = 100
    ) -> List[Meal]:
        """
        Get user meals with optional filtering.

        Args:
            db: Database session
            user_id: User ID
            start_date: Optional start date filter
            end_date: Optional end date filter
            meal_type: Optional meal type filter (breakfast, lunch, dinner, snack)
            limit: Maximum number of results

        Returns:
            List of meals
        """
        query = db.query(Meal).filter(Meal.user_id == user_id)

        if start_date:
            query = query.filter(Meal.meal_date >= start_date)
        if end_date:
            query = query.filter(Meal.meal_date <= end_date)
        if meal_type:
            query = query.filter(Meal.meal_type == meal_type)

        meals = query.order_by(
            Meal.meal_date.desc(),
            Meal.meal_time.desc()
        ).limit(limit).all()

        return meals

    @staticmethod
    def get_meal_by_id(
        db: Session,
        meal_id: int,
        user_id: int
    ) -> Meal:
        """
        Get specific meal by ID.

        Args:
            db: Database session
            meal_id: Meal ID
            user_id: User ID (for authorization)

        Returns:
            Meal

        Raises:
            HTTPException: If not found or unauthorized
        """
        meal = db.query(Meal).filter(
            Meal.id == meal_id,
            Meal.user_id == user_id
        ).first()

        if not meal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meal not found"
            )

        return meal

    @staticmethod
    def update_meal(
        db: Session,
        meal_id: int,
        user_id: int,
        meal_data: MealUpdate
    ) -> Meal:
        """Update meal."""
        meal = MealService.get_meal_by_id(db, meal_id, user_id)

        update_data = meal_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(meal, field, value)

        db.commit()
        db.refresh(meal)

        return meal

    @staticmethod
    def delete_meal(db: Session, meal_id: int, user_id: int) -> None:
        """Delete meal."""
        meal = MealService.get_meal_by_id(db, meal_id, user_id)

        db.delete(meal)
        db.commit()

    @staticmethod
    def get_daily_nutrition(db: Session, user_id: int, target_date: date) -> dict:
        """
        Get daily nutrition summary.

        Args:
            db: Database session
            user_id: User ID
            target_date: Target date

        Returns:
            Nutrition summary dict
        """
        meals = MealService.get_user_meals(
            db, user_id, start_date=target_date, end_date=target_date, limit=1000
        )

        total_calories = sum(m.calories or 0 for m in meals)
        total_protein = sum(m.protein_g or 0 for m in meals)
        total_carbs = sum(m.carbs_g or 0 for m in meals)
        total_fats = sum(m.fats_g or 0 for m in meals)
        total_fiber = sum(m.fiber_g or 0 for m in meals)
        total_water = sum(m.water_ml or 0 for m in meals)

        meal_breakdown = {}
        for meal in meals:
            meal_breakdown[meal.meal_type] = meal_breakdown.get(meal.meal_type, 0) + (meal.calories or 0)

        return {
            "date": target_date.isoformat(),
            "total_calories": total_calories,
            "total_protein_g": round(total_protein, 2),
            "total_carbs_g": round(total_carbs, 2),
            "total_fats_g": round(total_fats, 2),
            "total_fiber_g": round(total_fiber, 2),
            "total_water_ml": total_water,
            "meal_breakdown": meal_breakdown,
            "total_meals": len(meals)
        }

    @staticmethod
    def get_nutrition_stats(db: Session, user_id: int, start_date: date, end_date: date) -> dict:
        """
        Get nutrition statistics for a period.

        Args:
            db: Database session
            user_id: User ID
            start_date: Start date
            end_date: End date

        Returns:
            Statistics dict
        """
        meals = MealService.get_user_meals(
            db, user_id, start_date=start_date, end_date=end_date, limit=10000
        )

        num_days = (end_date - start_date).days + 1
        total_meals = len(meals)

        total_calories = sum(m.calories or 0 for m in meals)
        total_protein = sum(m.protein_g or 0 for m in meals)
        total_carbs = sum(m.carbs_g or 0 for m in meals)
        total_fats = sum(m.fats_g or 0 for m in meals)

        return {
            "period": {
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "num_days": num_days
            },
            "totals": {
                "total_meals": total_meals,
                "total_calories": total_calories,
                "total_protein_g": round(total_protein, 2),
                "total_carbs_g": round(total_carbs, 2),
                "total_fats_g": round(total_fats, 2)
            },
            "averages": {
                "avg_calories_per_day": round(total_calories / num_days, 2) if num_days > 0 else 0,
                "avg_protein_per_day": round(total_protein / num_days, 2) if num_days > 0 else 0,
                "avg_carbs_per_day": round(total_carbs / num_days, 2) if num_days > 0 else 0,
                "avg_fats_per_day": round(total_fats / num_days, 2) if num_days > 0 else 0,
                "avg_meals_per_day": round(total_meals / num_days, 2) if num_days > 0 else 0
            }
        }
