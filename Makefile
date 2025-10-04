.PHONY: help build up down logs shell db-shell clean migrate seed test

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build all Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"
	@echo "MinIO Console: http://localhost:9001"

dev: ## Start services in development mode with logs
	docker-compose up

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## Show logs from all services
	docker-compose logs -f

logs-backend: ## Show backend logs
	docker-compose logs -f backend

logs-frontend: ## Show frontend logs
	docker-compose logs -f frontend

shell-backend: ## Open shell in backend container
	docker-compose exec backend sh

shell-frontend: ## Open shell in frontend container
	docker-compose exec frontend sh

db-shell: ## Open PostgreSQL shell
	docker-compose exec db psql -U fitness_user -d fitness_tracker

migrate: ## Run database migrations
	docker-compose exec backend alembic upgrade head

migrate-create: ## Create new migration (use: make migrate-create MSG="description")
	docker-compose exec backend alembic revision --autogenerate -m "$(MSG)"

migrate-rollback: ## Rollback last migration
	docker-compose exec backend alembic downgrade -1

seed: ## Seed database with sample data
	docker-compose exec backend python scripts/seed.py

test-backend: ## Run backend tests
	docker-compose exec backend pytest

test-frontend: ## Run frontend tests
	docker-compose exec frontend npm test

clean: ## Remove all containers, volumes and networks
	docker-compose down -v
	@echo "✅ All cleaned up!"

clean-all: clean ## Remove everything including images
	docker-compose down -v --rmi all

ps: ## Show running containers
	docker-compose ps

stats: ## Show container resource usage
	docker stats

backup-db: ## Backup database
	@mkdir -p backups
	docker-compose exec -T db pg_dump -U fitness_user fitness_tracker > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "✅ Database backed up to backups/"

restore-db: ## Restore database from backup (use: make restore-db FILE=backup.sql)
	docker-compose exec -T db psql -U fitness_user -d fitness_tracker < $(FILE)

install: ## First time setup
	@echo "🚀 Setting up EvolucaoFit..."
	cp .env.example .env
	@echo "✅ Created .env file"
	docker-compose build
	@echo "✅ Built images"
	docker-compose up -d
	@echo "⏳ Waiting for services to start..."
	sleep 10
	docker-compose exec backend alembic upgrade head
	@echo "✅ Database migrated"
	@echo ""
	@echo "✅ Setup complete!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000/docs"
