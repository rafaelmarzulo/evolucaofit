"""
Goal model - track user fitness goals.
"""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from ...core.database import Base


class Goal(Base):
    """User fitness goal."""

    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Goal info
    goal_type = Column(String(50), nullable=False)  # weight_loss, muscle_gain, endurance, strength, etc.
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    # Targets
    target_weight_kg = Column(Float, nullable=True)
    target_body_fat_percentage = Column(Float, nullable=True)
    target_muscle_mass_kg = Column(Float, nullable=True)
    target_value = Column(Float, nullable=True)  # Generic target for custom goals
    target_unit = Column(String(50), nullable=True)  # kg, cm, %, etc.

    # Timeline
    start_date = Column(Date, nullable=False)
    target_date = Column(Date, nullable=True)
    completed_date = Column(Date, nullable=True)

    # Status
    is_completed = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Progress tracking
    current_progress = Column(Float, nullable=True)  # Percentage or value
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="goals")

    def __repr__(self):
        return f"<Goal(id={self.id}, user_id={self.user_id}, type='{self.goal_type}', title='{self.title}')>"
