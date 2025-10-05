#!/bin/bash
set -e

echo "Starting database migrations..."
cd /app
echo "Current directory: $(pwd)"
echo "Contents: $(ls -la)"

echo "Running alembic upgrade head..."
alembic upgrade head

echo "Migrations completed successfully!"
