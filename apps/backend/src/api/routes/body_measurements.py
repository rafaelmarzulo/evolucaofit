"""
Body measurement routes.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from ...core.database import get_db
from ...core.dependencies import get_current_active_user
from ...database.models import User
from ..schemas.body_measurement import (
    BodyMeasurementCreate,
    BodyMeasurementUpdate,
    BodyMeasurementResponse
)
from ..services.body_measurement_service import BodyMeasurementService

router = APIRouter(prefix="/measurements", tags=["Body Measurements"])


@router.post("/", response_model=BodyMeasurementResponse, status_code=201)
async def create_measurement(
    measurement_data: BodyMeasurementCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new body measurement.

    Requires authentication.
    """
    measurement = BodyMeasurementService.create_measurement(
        db, current_user, measurement_data
    )
    return measurement


@router.get("/", response_model=List[BodyMeasurementResponse])
async def get_measurements(
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    limit: int = Query(100, ge=1, le=500, description="Maximum results"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's body measurements.

    Supports date filtering and pagination.
    """
    measurements = BodyMeasurementService.get_user_measurements(
        db, current_user.id, start_date, end_date, limit
    )
    return measurements


@router.get("/latest", response_model=BodyMeasurementResponse)
async def get_latest_measurement(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's latest measurement."""
    measurement = BodyMeasurementService.get_latest_measurement(db, current_user.id)
    return measurement


@router.get("/{measurement_id}", response_model=BodyMeasurementResponse)
async def get_measurement(
    measurement_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific measurement by ID."""
    measurement = BodyMeasurementService.get_measurement_by_id(
        db, measurement_id, current_user.id
    )
    return measurement


@router.put("/{measurement_id}", response_model=BodyMeasurementResponse)
async def update_measurement(
    measurement_id: int,
    measurement_data: BodyMeasurementUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update measurement."""
    measurement = BodyMeasurementService.update_measurement(
        db, measurement_id, current_user.id, measurement_data
    )
    return measurement


@router.delete("/{measurement_id}", status_code=204)
async def delete_measurement(
    measurement_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete measurement."""
    BodyMeasurementService.delete_measurement(db, measurement_id, current_user.id)
    return None
