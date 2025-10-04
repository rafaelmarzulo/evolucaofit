"""
Body Measurement model - tracks physical measurements over time.
"""
from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime

from ...core.database import Base


class BodyMeasurement(Base):
    """Body measurement tracking."""

    __tablename__ = "body_measurements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    measurement_date = Column(Date, nullable=False, index=True)

    # Basic metrics
    weight_kg = Column(Float, nullable=False)
    body_fat_percentage = Column(Float, nullable=True)
    muscle_mass_kg = Column(Float, nullable=True)
    bmi = Column(Float, nullable=True)  # Calculated: weight / (height/100)^2

    # Circumferences (cm)
    neck_cm = Column(Float, nullable=True)
    chest_cm = Column(Float, nullable=True)
    waist_cm = Column(Float, nullable=True)
    abdomen_cm = Column(Float, nullable=True)
    hips_cm = Column(Float, nullable=True)

    # Arms
    right_bicep_cm = Column(Float, nullable=True)
    left_bicep_cm = Column(Float, nullable=True)
    right_forearm_cm = Column(Float, nullable=True)
    left_forearm_cm = Column(Float, nullable=True)

    # Legs
    right_thigh_cm = Column(Float, nullable=True)
    left_thigh_cm = Column(Float, nullable=True)
    right_calf_cm = Column(Float, nullable=True)
    left_calf_cm = Column(Float, nullable=True)

    # Skin folds (mm) - for more advanced tracking
    bicep_skinfold_mm = Column(Float, nullable=True)
    tricep_skinfold_mm = Column(Float, nullable=True)
    subscapular_skinfold_mm = Column(Float, nullable=True)
    suprailiac_skinfold_mm = Column(Float, nullable=True)
    abdominal_skinfold_mm = Column(Float, nullable=True)
    thigh_skinfold_mm = Column(Float, nullable=True)

    # Additional info
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="body_measurements")

    def __repr__(self):
        return f"<BodyMeasurement(id={self.id}, user_id={self.user_id}, date='{self.measurement_date}', weight={self.weight_kg}kg)>"
