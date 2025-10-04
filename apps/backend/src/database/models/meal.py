"""
Meal model - track nutrition and meals.
"""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
from datetime import datetime

from ...core.database import Base


class Meal(Base):
    """Meal tracking."""

    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    meal_date = Column(Date, nullable=False, index=True)
    meal_time = Column(Time, nullable=True)

    # Meal info
    meal_type = Column(String(50), nullable=False)  # breakfast, lunch, dinner, snack
    meal_name = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)

    # Macros (grams)
    calories = Column(Integer, nullable=True)
    protein_g = Column(Float, nullable=True)
    carbs_g = Column(Float, nullable=True)
    fats_g = Column(Float, nullable=True)
    fiber_g = Column(Float, nullable=True)

    # Hydration
    water_ml = Column(Integer, nullable=True)

    # Notes
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="meals")

    def __repr__(self):
        return f"<Meal(id={self.id}, user_id={self.user_id}, date='{self.meal_date}', type='{self.meal_type}')>"
