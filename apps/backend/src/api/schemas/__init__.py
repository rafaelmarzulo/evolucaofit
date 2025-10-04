"""API schemas package."""
from .user import UserCreate, UserUpdate, UserResponse, UserLogin, Token
from .body_measurement import BodyMeasurementCreate, BodyMeasurementUpdate, BodyMeasurementResponse
from .progress_photo import ProgressPhotoCreate, ProgressPhotoResponse
from .workout import WorkoutCreate, WorkoutUpdate, WorkoutResponse, ExerciseCreate, ExerciseResponse
from .meal import MealCreate, MealUpdate, MealResponse
from .goal import GoalCreate, GoalUpdate, GoalResponse

__all__ = [
    # User
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserLogin",
    "Token",
    # Body Measurement
    "BodyMeasurementCreate",
    "BodyMeasurementUpdate",
    "BodyMeasurementResponse",
    # Progress Photo
    "ProgressPhotoCreate",
    "ProgressPhotoResponse",
    # Workout
    "WorkoutCreate",
    "WorkoutUpdate",
    "WorkoutResponse",
    "ExerciseCreate",
    "ExerciseResponse",
    # Meal
    "MealCreate",
    "MealUpdate",
    "MealResponse",
    # Goal
    "GoalCreate",
    "GoalUpdate",
    "GoalResponse",
]
