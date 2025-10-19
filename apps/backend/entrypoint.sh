#!/bin/bash
set -e

echo "Skipping database migrations (tables already exist)..."
# alembic upgrade head

echo "Starting application..."
exec uvicorn src.main:app --host 0.0.0.0 --port 8000
