"""
Administrative endpoints for database management.
"""
from fastapi import APIRouter, HTTPException
from src.core.database import Base, engine

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/init-db")
async def initialize_database():
    """
    Create all database tables.
    WARNING: This is a one-time operation for initial setup.
    """
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        return {
            "status": "success",
            "message": "Database tables created successfully",
            "tables": [table.name for table in Base.metadata.sorted_tables]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create tables: {str(e)}")
