"""Progress photo schemas."""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, date


class ProgressPhotoBase(BaseModel):
    """Base progress photo schema."""
    photo_date: date
    photo_type: str = Field(..., pattern="^(front|back|side|other)$")


class ProgressPhotoCreate(ProgressPhotoBase):
    """Schema for creating progress photo."""
    weight_at_photo_kg: Optional[int] = Field(None, ge=20, le=500)
    notes: Optional[str] = None


class ProgressPhotoResponse(ProgressPhotoBase):
    """Schema for progress photo response."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    photo_url: str
    thumbnail_url: Optional[str] = None
    weight_at_photo_kg: Optional[int] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
