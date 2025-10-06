"""API routes package."""
from .auth import router as auth_router
from .body_measurements import router as body_measurements_router
from .users import router as users_router
from .workouts import router as workouts_router
from .meals import router as meals_router
from .goals import router as goals_router
from .progress_photos import router as progress_photos_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "body_measurements_router",
    "users_router",
    "workouts_router",
    "meals_router",
    "goals_router",
    "progress_photos_router",
    "admin_router",
]
