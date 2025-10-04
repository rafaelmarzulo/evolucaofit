"""Meal schemas."""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, date, time


class MealBase(BaseModel):
    """Base meal schema."""
    meal_date: date
    meal_type: str = Field(..., pattern="^(breakfast|lunch|dinner|snack)$")


class MealCreate(MealBase):
    """Schema for creating meal."""
    meal_time: Optional[time] = None
    meal_name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    calories: Optional[int] = Field(None, ge=0, le=10000)
    protein_g: Optional[float] = Field(None, ge=0, le=1000)
    carbs_g: Optional[float] = Field(None, ge=0, le=1000)
    fats_g: Optional[float] = Field(None, ge=0, le=1000)
    fiber_g: Optional[float] = Field(None, ge=0, le=200)
    water_ml: Optional[int] = Field(None, ge=0, le=10000)
    notes: Optional[str] = None


class MealUpdate(BaseModel):
    """Schema for updating meal."""
    meal_time: Optional[time] = None
    meal_name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    calories: Optional[int] = Field(None, ge=0, le=10000)
    protein_g: Optional[float] = Field(None, ge=0, le=1000)
    carbs_g: Optional[float] = Field(None, ge=0, le=1000)
    fats_g: Optional[float] = Field(None, ge=0, le=1000)
    fiber_g: Optional[float] = Field(None, ge=0, le=200)
    water_ml: Optional[int] = Field(None, ge=0, le=10000)
    notes: Optional[str] = None


class MealResponse(MealBase):
    """Schema for meal response."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    meal_time: Optional[time] = None
    meal_name: Optional[str] = None
    description: Optional[str] = None
    calories: Optional[int] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fats_g: Optional[float] = None
    fiber_g: Optional[float] = None
    water_ml: Optional[int] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
