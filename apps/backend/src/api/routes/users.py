"""
User routes - user profile management.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ...core.database import get_db
from ...core.dependencies import get_current_active_user
from ...database.models import User
from ..schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


def get_current_admin_user(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Verify that current user is an admin."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access this resource"
        )
    return current_user


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user profile.

    Requires authentication.
    """
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user profile.

    Requires authentication.
    """
    update_data = user_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return current_user


@router.get("/admin/all", response_model=List[UserResponse])
async def get_all_users_admin(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    Get all users (admin only).

    Requires admin authentication.
    """
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users


@router.get("/admin/users/{user_id}/measurements")
async def get_user_measurements_admin(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    Get measurements for a specific user (admin only).

    Requires admin authentication.
    """
    from ...database.models import BodyMeasurement
    from ..schemas.user import UserResponse

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    measurements = db.query(BodyMeasurement).filter(
        BodyMeasurement.user_id == user_id
    ).order_by(BodyMeasurement.measurement_date.desc()).all()

    # Convert user to dict using UserResponse schema
    user_dict = UserResponse.model_validate(user).model_dump()

    # Convert measurements to list of dicts
    measurements_list = [
        {
            "id": m.id,
            "user_id": m.user_id,
            "measurement_date": m.measurement_date.isoformat(),
            "weight_kg": float(m.weight_kg),
            "body_fat_percentage": float(m.body_fat_percentage) if m.body_fat_percentage else None,
            "muscle_mass_kg": float(m.muscle_mass_kg) if m.muscle_mass_kg else None,
            "bmi": float(m.bmi) if m.bmi else None,
            "neck_cm": float(m.neck_cm) if m.neck_cm else None,
            "chest_cm": float(m.chest_cm) if m.chest_cm else None,
            "waist_cm": float(m.waist_cm) if m.waist_cm else None,
            "abdomen_cm": float(m.abdomen_cm) if m.abdomen_cm else None,
            "hip_cm": float(m.hip_cm) if m.hip_cm else None,
            "right_bicep_cm": float(m.right_bicep_cm) if m.right_bicep_cm else None,
            "left_bicep_cm": float(m.left_bicep_cm) if m.left_bicep_cm else None,
            "right_forearm_cm": float(m.right_forearm_cm) if m.right_forearm_cm else None,
            "left_forearm_cm": float(m.left_forearm_cm) if m.left_forearm_cm else None,
            "right_thigh_cm": float(m.right_thigh_cm) if m.right_thigh_cm else None,
            "left_thigh_cm": float(m.left_thigh_cm) if m.left_thigh_cm else None,
            "right_calf_cm": float(m.right_calf_cm) if m.right_calf_cm else None,
            "left_calf_cm": float(m.left_calf_cm) if m.left_calf_cm else None,
            "notes": m.notes,
        }
        for m in measurements
    ]

    return {
        "user": user_dict,
        "measurements": measurements_list,
        "total_measurements": len(measurements)
    }
