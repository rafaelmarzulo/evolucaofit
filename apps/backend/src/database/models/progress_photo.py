"""
Progress Photo model - stores progress photos for visual tracking.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime

from ...core.database import Base


class ProgressPhoto(Base):
    """Progress photo tracking."""

    __tablename__ = "progress_photos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    photo_date = Column(Date, nullable=False, index=True)

    # Photo info
    photo_url = Column(String(500), nullable=False)  # S3 URL
    photo_type = Column(String(50), nullable=False)  # front, back, side, other
    thumbnail_url = Column(String(500), nullable=True)

    # Metadata
    weight_at_photo_kg = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="progress_photos")

    def __repr__(self):
        return f"<ProgressPhoto(id={self.id}, user_id={self.user_id}, date='{self.photo_date}', type='{self.photo_type}')>"
