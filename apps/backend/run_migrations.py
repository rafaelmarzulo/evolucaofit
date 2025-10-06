#!/usr/bin/env python3
"""
Script to run database migrations with proper permissions setup.
"""
import os
import sys
from sqlalchemy import create_engine, text
from alembic.config import Config
from alembic import command

def setup_permissions():
    """Grant necessary permissions to the database user."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL not set")
        sys.exit(1)

    print(f"Connecting to database...")
    engine = create_engine(database_url)

    try:
        with engine.connect() as conn:
            # Get current user
            result = conn.execute(text("SELECT current_user"))
            current_user = result.scalar()
            print(f"Current database user: {current_user}")

            # Grant permissions on schema public
            print("Granting permissions on schema public...")
            conn.execute(text(f"GRANT ALL ON SCHEMA public TO {current_user}"))
            conn.execute(text(f"GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO {current_user}"))
            conn.execute(text(f"GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO {current_user}"))
            conn.execute(text(f"ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO {current_user}"))
            conn.execute(text(f"ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO {current_user}"))
            conn.commit()
            print("Permissions granted successfully")
    except Exception as e:
        print(f"Warning: Could not grant permissions: {e}")
        print("Continuing with migrations anyway...")

def run_migrations():
    """Run Alembic migrations."""
    print("Running Alembic migrations...")
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    print("Migrations completed successfully!")

if __name__ == "__main__":
    print("=== Database Migration Script ===")
    setup_permissions()
    run_migrations()
    print("=== Migration process completed ===")
