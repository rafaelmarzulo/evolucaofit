"""Workout and exercise schemas."""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, date


class ExerciseBase(BaseModel):
    """Base exercise schema."""
    exercise_name: str = Field(..., min_length=1, max_length=200)
    exercise_type: Optional[str] = Field(None, pattern="^(compound|isolation|cardio)$")


class ExerciseCreate(ExerciseBase):
    """Schema for creating exercise."""
    sets: Optional[int] = Field(None, ge=1, le=50)
    reps: Optional[int] = Field(None, ge=1, le=500)
    weight_kg: Optional[float] = Field(None, ge=0, le=1000)
    rest_seconds: Optional[int] = Field(None, ge=0, le=600)
    distance_km: Optional[float] = Field(None, ge=0, le=1000)
    duration_minutes: Optional[int] = Field(None, ge=0, le=600)
    order_index: int = Field(default=0, ge=0)
    notes: Optional[str] = None


class ExerciseResponse(ExerciseBase):
    """Schema for exercise response."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    workout_id: int
    sets: Optional[int] = None
    reps: Optional[int] = None
    weight_kg: Optional[float] = None
    rest_seconds: Optional[int] = None
    distance_km: Optional[float] = None
    duration_minutes: Optional[int] = None
    order_index: int
    notes: Optional[str] = None
    created_at: datetime


class WorkoutBase(BaseModel):
    """Base workout schema."""
    workout_date: date
    workout_type: str = Field(..., min_length=1, max_length=100)


class WorkoutCreate(WorkoutBase):
    """Schema for creating workout."""
    duration_minutes: Optional[int] = Field(None, ge=0, le=600)
    calories_burned: Optional[int] = Field(None, ge=0, le=10000)
    intensity: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    feeling: Optional[str] = Field(None, pattern="^(great|good|ok|tired|exhausted)$")
    notes: Optional[str] = None
    exercises: List[ExerciseCreate] = []


class WorkoutUpdate(BaseModel):
    """Schema for updating workout."""
    workout_type: Optional[str] = Field(None, min_length=1, max_length=100)
    duration_minutes: Optional[int] = Field(None, ge=0, le=600)
    calories_burned: Optional[int] = Field(None, ge=0, le=10000)
    intensity: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    feeling: Optional[str] = Field(None, pattern="^(great|good|ok|tired|exhausted)$")
    notes: Optional[str] = None


class WorkoutResponse(WorkoutBase):
    """Schema for workout response."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    duration_minutes: Optional[int] = None
    calories_burned: Optional[int] = None
    intensity: Optional[str] = None
    feeling: Optional[str] = None
    notes: Optional[str] = None
    exercises: List[ExerciseResponse] = []
    created_at: datetime
    updated_at: datetime
