"""Goal schemas."""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, date


class GoalBase(BaseModel):
    """Base goal schema."""
    goal_type: str = Field(..., min_length=1, max_length=50)
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None


class GoalCreate(GoalBase):
    """Schema for creating goal."""
    target_weight_kg: Optional[float] = Field(None, ge=20, le=500)
    target_body_fat_percentage: Optional[float] = Field(None, ge=0, le=100)
    target_muscle_mass_kg: Optional[float] = Field(None, ge=0, le=200)
    target_value: Optional[float] = None
    target_unit: Optional[str] = Field(None, max_length=50)
    start_date: date
    target_date: Optional[date] = None
    notes: Optional[str] = None


class GoalUpdate(BaseModel):
    """Schema for updating goal."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    target_weight_kg: Optional[float] = Field(None, ge=20, le=500)
    target_body_fat_percentage: Optional[float] = Field(None, ge=0, le=100)
    target_muscle_mass_kg: Optional[float] = Field(None, ge=0, le=200)
    target_value: Optional[float] = None
    target_date: Optional[date] = None
    current_progress: Optional[float] = None
    is_completed: Optional[bool] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None


class GoalResponse(GoalBase):
    """Schema for goal response."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    target_weight_kg: Optional[float] = None
    target_body_fat_percentage: Optional[float] = None
    target_muscle_mass_kg: Optional[float] = None
    target_value: Optional[float] = None
    target_unit: Optional[str] = None
    start_date: date
    target_date: Optional[date] = None
    completed_date: Optional[date] = None
    is_completed: bool
    is_active: bool
    current_progress: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
