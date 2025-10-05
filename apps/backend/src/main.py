"""
EvolucaoFit API - Main application file.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog

from .core.config import get_settings
from .core.database import init_db
from .api.routes import (
    auth_router,
    body_measurements_router,
    users_router,
    workouts_router,
    meals_router,
    goals_router,
    progress_photos_router
)

settings = get_settings()
logger = structlog.get_logger()

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API for tracking fitness progress",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API info."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health"
    }


# Include routers
app.include_router(auth_router, prefix="/v1")
app.include_router(users_router, prefix="/v1")
app.include_router(body_measurements_router, prefix="/v1")
app.include_router(workouts_router, prefix="/v1")
app.include_router(meals_router, prefix="/v1")
app.include_router(goals_router, prefix="/v1")
app.include_router(progress_photos_router, prefix="/v1")


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info("Starting EvolucaoFit API", version=settings.APP_VERSION)

    # Initialize database
    if settings.ENVIRONMENT == "development":
        logger.info("Initializing database tables...")
        init_db()


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("Shutting down EvolucaoFit API")


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle unexpected exceptions."""
    logger.error("Unhandled exception", error=str(exc), path=request.url.path)

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error" if settings.ENVIRONMENT == "production" else str(exc)
        }
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info"
    )
