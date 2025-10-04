"""Body measurement schemas."""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, date


class BodyMeasurementBase(BaseModel):
    """Base body measurement schema."""
    measurement_date: date
    weight_kg: float = Field(..., ge=20, le=500)
    body_fat_percentage: Optional[float] = Field(None, ge=0, le=100)
    muscle_mass_kg: Optional[float] = Field(None, ge=0, le=200)


class BodyMeasurementCreate(BodyMeasurementBase):
    """Schema for creating body measurement."""
    # Circumferences
    neck_cm: Optional[float] = Field(None, ge=0, le=100)
    chest_cm: Optional[float] = Field(None, ge=0, le=200)
    waist_cm: Optional[float] = Field(None, ge=0, le=200)
    abdomen_cm: Optional[float] = Field(None, ge=0, le=200)
    hips_cm: Optional[float] = Field(None, ge=0, le=200)
    right_bicep_cm: Optional[float] = Field(None, ge=0, le=100)
    left_bicep_cm: Optional[float] = Field(None, ge=0, le=100)
    right_forearm_cm: Optional[float] = Field(None, ge=0, le=100)
    left_forearm_cm: Optional[float] = Field(None, ge=0, le=100)
    right_thigh_cm: Optional[float] = Field(None, ge=0, le=150)
    left_thigh_cm: Optional[float] = Field(None, ge=0, le=150)
    right_calf_cm: Optional[float] = Field(None, ge=0, le=100)
    left_calf_cm: Optional[float] = Field(None, ge=0, le=100)

    # Skin folds
    bicep_skinfold_mm: Optional[float] = Field(None, ge=0, le=100)
    tricep_skinfold_mm: Optional[float] = Field(None, ge=0, le=100)
    subscapular_skinfold_mm: Optional[float] = Field(None, ge=0, le=100)
    suprailiac_skinfold_mm: Optional[float] = Field(None, ge=0, le=100)
    abdominal_skinfold_mm: Optional[float] = Field(None, ge=0, le=100)
    thigh_skinfold_mm: Optional[float] = Field(None, ge=0, le=100)

    notes: Optional[str] = None


class BodyMeasurementUpdate(BaseModel):
    """Schema for updating body measurement."""
    weight_kg: Optional[float] = Field(None, ge=20, le=500)
    body_fat_percentage: Optional[float] = Field(None, ge=0, le=100)
    notes: Optional[str] = None


class BodyMeasurementResponse(BodyMeasurementBase):
    """Schema for body measurement response."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    bmi: Optional[float] = None
    neck_cm: Optional[float] = None
    chest_cm: Optional[float] = None
    waist_cm: Optional[float] = None
    abdomen_cm: Optional[float] = None
    hips_cm: Optional[float] = None
    right_bicep_cm: Optional[float] = None
    left_bicep_cm: Optional[float] = None
    right_forearm_cm: Optional[float] = None
    left_forearm_cm: Optional[float] = None
    right_thigh_cm: Optional[float] = None
    left_thigh_cm: Optional[float] = None
    right_calf_cm: Optional[float] = None
    left_calf_cm: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
