"""
Progress Photo service - handles photo upload and management.
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from typing import List, Optional
from datetime import date
import uuid
from pathlib import Path

from ...database.models import ProgressPhoto, User
from ..schemas.progress_photo import ProgressPhotoCreate


class ProgressPhotoService:
    """Progress photo service."""

    @staticmethod
    async def upload_photo(
        file: UploadFile,
        user_id: int,
        photo_type: str
    ) -> str:
        """
        Upload photo to storage (MinIO/S3).

        Args:
            file: Uploaded file
            user_id: User ID
            photo_type: Photo type (front, back, side, other)

        Returns:
            Photo URL

        Note: This is a placeholder implementation.
        In production, integrate with MinIO/S3 client.
        """
        # Validate file type
        allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}"
            )

        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{user_id}/{photo_type}/{uuid.uuid4()}{file_extension}"

        # TODO: Implement actual MinIO/S3 upload
        # For now, return placeholder URL
        photo_url = f"https://storage.example.com/progress-photos/{unique_filename}"

        # In production, upload to MinIO:
        # from minio import Minio
        # client = Minio(...)
        # client.put_object(
        #     bucket_name="progress-photos",
        #     object_name=unique_filename,
        #     data=file.file,
        #     length=file.size,
        #     content_type=file.content_type
        # )

        return photo_url

    @staticmethod
    async def create_progress_photo(
        db: Session,
        user: User,
        photo_data: ProgressPhotoCreate,
        file: UploadFile
    ) -> ProgressPhoto:
        """
        Create a new progress photo.

        Args:
            db: Database session
            user: Current user
            photo_data: Photo data
            file: Uploaded photo file

        Returns:
            Created progress photo
        """
        # Upload photo
        photo_url = await ProgressPhotoService.upload_photo(
            file, user.id, photo_data.photo_type
        )

        # Create database record
        progress_photo = ProgressPhoto(
            user_id=user.id,
            photo_url=photo_url,
            **photo_data.model_dump()
        )

        db.add(progress_photo)
        db.commit()
        db.refresh(progress_photo)

        return progress_photo

    @staticmethod
    def get_user_photos(
        db: Session,
        user_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        photo_type: Optional[str] = None,
        limit: int = 100
    ) -> List[ProgressPhoto]:
        """
        Get user progress photos with optional filtering.

        Args:
            db: Database session
            user_id: User ID
            start_date: Optional start date filter
            end_date: Optional end date filter
            photo_type: Optional photo type filter
            limit: Maximum number of results

        Returns:
            List of progress photos
        """
        query = db.query(ProgressPhoto).filter(ProgressPhoto.user_id == user_id)

        if start_date:
            query = query.filter(ProgressPhoto.photo_date >= start_date)
        if end_date:
            query = query.filter(ProgressPhoto.photo_date <= end_date)
        if photo_type:
            query = query.filter(ProgressPhoto.photo_type == photo_type)

        photos = query.order_by(
            ProgressPhoto.photo_date.desc()
        ).limit(limit).all()

        return photos

    @staticmethod
    def get_photo_by_id(
        db: Session,
        photo_id: int,
        user_id: int
    ) -> ProgressPhoto:
        """
        Get specific photo by ID.

        Args:
            db: Database session
            photo_id: Photo ID
            user_id: User ID (for authorization)

        Returns:
            Progress photo

        Raises:
            HTTPException: If not found or unauthorized
        """
        photo = db.query(ProgressPhoto).filter(
            ProgressPhoto.id == photo_id,
            ProgressPhoto.user_id == user_id
        ).first()

        if not photo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Photo not found"
            )

        return photo

    @staticmethod
    async def delete_photo(db: Session, photo_id: int, user_id: int) -> None:
        """
        Delete progress photo.

        Args:
            db: Database session
            photo_id: Photo ID
            user_id: User ID

        Note: Should also delete from storage in production.
        """
        photo = ProgressPhotoService.get_photo_by_id(db, photo_id, user_id)

        # TODO: Delete from MinIO/S3 storage
        # Extract filename from URL and delete from storage

        db.delete(photo)
        db.commit()

    @staticmethod
    def get_comparison_photos(
        db: Session,
        user_id: int,
        start_date: date,
        end_date: date,
        photo_type: str
    ) -> dict:
        """
        Get before/after comparison photos.

        Args:
            db: Database session
            user_id: User ID
            start_date: Start date
            end_date: End date
            photo_type: Photo type

        Returns:
            Dict with before and after photos
        """
        # Get earliest photo (before)
        before_photo = db.query(ProgressPhoto).filter(
            ProgressPhoto.user_id == user_id,
            ProgressPhoto.photo_type == photo_type,
            ProgressPhoto.photo_date >= start_date
        ).order_by(ProgressPhoto.photo_date.asc()).first()

        # Get latest photo (after)
        after_photo = db.query(ProgressPhoto).filter(
            ProgressPhoto.user_id == user_id,
            ProgressPhoto.photo_type == photo_type,
            ProgressPhoto.photo_date <= end_date
        ).order_by(ProgressPhoto.photo_date.desc()).first()

        return {
            "before": before_photo,
            "after": after_photo,
            "photo_type": photo_type,
            "period": {
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat()
            }
        }
