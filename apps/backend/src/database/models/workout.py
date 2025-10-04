"""
Workout and Exercise models - track training sessions.
"""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime

from ...core.database import Base


class Workout(Base):
    """Workout session."""

    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    workout_date = Column(Date, nullable=False, index=True)

    # Workout info
    workout_type = Column(String(100), nullable=False)  # strength, cardio, hiit, yoga, etc.
    duration_minutes = Column(Integer, nullable=True)
    calories_burned = Column(Integer, nullable=True)

    # General notes
    notes = Column(Text, nullable=True)
    intensity = Column(String(20), nullable=True)  # low, medium, high
    feeling = Column(String(20), nullable=True)  # great, good, ok, tired, exhausted

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="workouts")
    exercises = relationship("Exercise", back_populates="workout", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Workout(id={self.id}, user_id={self.user_id}, date='{self.workout_date}', type='{self.workout_type}')>"


class Exercise(Base):
    """Exercise within a workout."""

    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    workout_id = Column(Integer, ForeignKey("workouts.id"), nullable=False, index=True)

    # Exercise details
    exercise_name = Column(String(200), nullable=False)
    exercise_type = Column(String(50), nullable=True)  # compound, isolation, cardio

    # For strength training
    sets = Column(Integer, nullable=True)
    reps = Column(Integer, nullable=True)
    weight_kg = Column(Float, nullable=True)
    rest_seconds = Column(Integer, nullable=True)

    # For cardio
    distance_km = Column(Float, nullable=True)
    duration_minutes = Column(Integer, nullable=True)

    # Order in workout
    order_index = Column(Integer, default=0)

    # Notes
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    workout = relationship("Workout", back_populates="exercises")

    def __repr__(self):
        return f"<Exercise(id={self.id}, name='{self.exercise_name}', sets={self.sets}, reps={self.reps}, weight={self.weight_kg}kg)>"
