"""
Body measurement service - handles body measurement logic.
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import date

from ...database.models import BodyMeasurement, User
from ..schemas.body_measurement import BodyMeasurementCreate, BodyMeasurementUpdate


class BodyMeasurementService:
    """Body measurement service."""

    @staticmethod
    def calculate_bmi(weight_kg: float, height_cm: int) -> float:
        """Calculate BMI from weight and height."""
        height_m = height_cm / 100
        return round(weight_kg / (height_m ** 2), 2)

    @staticmethod
    def create_measurement(
        db: Session,
        user: User,
        measurement_data: BodyMeasurementCreate
    ) -> BodyMeasurement:
        """
        Create a new body measurement.

        Args:
            db: Database session
            user: Current user
            measurement_data: Measurement data

        Returns:
            Created measurement
        """
        # Calculate BMI if user has height
        bmi = None
        if user.height_cm:
            bmi = BodyMeasurementService.calculate_bmi(
                measurement_data.weight_kg,
                user.height_cm
            )

        # Create measurement
        measurement = BodyMeasurement(
            user_id=user.id,
            bmi=bmi,
            **measurement_data.model_dump()
        )

        db.add(measurement)
        db.commit()
        db.refresh(measurement)

        return measurement

    @staticmethod
    def get_user_measurements(
        db: Session,
        user_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        limit: int = 100
    ) -> List[BodyMeasurement]:
        """
        Get user measurements with optional date filtering.

        Args:
            db: Database session
            user_id: User ID
            start_date: Optional start date filter
            end_date: Optional end date filter
            limit: Maximum number of results

        Returns:
            List of measurements
        """
        query = db.query(BodyMeasurement).filter(BodyMeasurement.user_id == user_id)

        if start_date:
            query = query.filter(BodyMeasurement.measurement_date >= start_date)
        if end_date:
            query = query.filter(BodyMeasurement.measurement_date <= end_date)

        measurements = query.order_by(
            BodyMeasurement.measurement_date.desc()
        ).limit(limit).all()

        return measurements

    @staticmethod
    def get_measurement_by_id(
        db: Session,
        measurement_id: int,
        user_id: int
    ) -> BodyMeasurement:
        """
        Get specific measurement by ID.

        Args:
            db: Database session
            measurement_id: Measurement ID
            user_id: User ID (for authorization)

        Returns:
            Measurement

        Raises:
            HTTPException: If not found or unauthorized
        """
        measurement = db.query(BodyMeasurement).filter(
            BodyMeasurement.id == measurement_id,
            BodyMeasurement.user_id == user_id
        ).first()

        if not measurement:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Measurement not found"
            )

        return measurement

    @staticmethod
    def update_measurement(
        db: Session,
        measurement_id: int,
        user_id: int,
        measurement_data: BodyMeasurementUpdate
    ) -> BodyMeasurement:
        """Update measurement."""
        measurement = BodyMeasurementService.get_measurement_by_id(
            db, measurement_id, user_id
        )

        update_data = measurement_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(measurement, field, value)

        db.commit()
        db.refresh(measurement)

        return measurement

    @staticmethod
    def delete_measurement(db: Session, measurement_id: int, user_id: int) -> None:
        """Delete measurement."""
        measurement = BodyMeasurementService.get_measurement_by_id(
            db, measurement_id, user_id
        )

        db.delete(measurement)
        db.commit()

    @staticmethod
    def get_latest_measurement(db: Session, user_id: int) -> Optional[BodyMeasurement]:
        """Get user's latest measurement."""
        return db.query(BodyMeasurement).filter(
            BodyMeasurement.user_id == user_id
        ).order_by(
            BodyMeasurement.measurement_date.desc()
        ).first()
