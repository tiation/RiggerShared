# RiggerShared - Enterprise CI/CD Makefile
# Convenient commands for development and deployment operations

.PHONY: help install build test lint format clean docker deploy

# Default target
help:
	@echo "RiggerShared - Available Commands:"
	@echo "  install        Install dependencies"
	@echo "  build          Build the application"
	@echo "  test           Run all tests"
	@echo "  lint           Run linting"
	@echo "  format         Format code"
	@echo "  clean          Clean build artifacts"
	@echo "  docker         Build Docker image"
	@echo "  deploy-staging Deploy to staging"
	@echo "  deploy-prod    Deploy to production"
	@echo "  security       Run security checks"
	@echo "  release        Create a new release"

# Development commands
install:
	npm ci

build:
	npm run build

build-prod:
	npm run build:prod

test:
	npm run test

test-coverage:
	npm run test:coverage

test-integration:
	docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
	docker-compose -f docker-compose.test.yml down

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

format-check:
	npm run format:check

type-check:
	npm run type-check

# Security commands
security:
	npm run security:audit

security-fix:
	npm run security:fix

# Docker commands
docker:
	docker build -t riggershared .

docker-enhanced:
	docker build -f Dockerfile.enhanced -t riggershared:enhanced .

docker-run:
	docker run -p 3000:3000 riggershared

docker-test:
	docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Deployment commands
deploy-staging:
	./scripts/deploy-all-platforms.sh staging

deploy-prod:
	./scripts/deploy-all-platforms.sh production

# Release commands
release:
	npm run release

release-dry:
	npx semantic-release --dry-run

# Maintenance commands
clean:
	npm run clean
	docker system prune -f

clean-all:
	npm run clean
	rm -rf node_modules
	docker system prune -af

# Quality checks
quality-gate:
	npm run lint
	npm run type-check
	npm run test:coverage
	npm run security:audit

# CI/CD simulation
ci-test:
	@echo "Running CI pipeline simulation..."
	$(MAKE) install
	$(MAKE) lint
	$(MAKE) type-check
	$(MAKE) test-coverage
	$(MAKE) security
	$(MAKE) build
	@echo "CI pipeline simulation completed successfully!"

# Development environment
dev-setup:
	./scripts/dev-setup.sh start

dev-stop:
	./scripts/dev-setup.sh stop

dev-logs:
	./scripts/dev-setup.sh logs

# Monitoring and health checks
health-check:
	curl -f http://localhost:3000/health || echo "Health check failed"

metrics:
	curl -f http://localhost:3000/metrics || echo "Metrics endpoint failed"

# Documentation
docs:
	npm run build:docs

docs-serve:
	npx http-server docs -p 8080

# Package management
audit:
	npm audit

outdated:
	npm outdated

# Git hooks setup
hooks:
	npm run prepare

# Version information
version:
	@echo "Package version: $(shell node -p "require('./package.json').version")"
	@echo "Node version: $(shell node --version)"
	@echo "NPM version: $(shell npm --version)"
	@echo "Docker version: $(shell docker --version)"

# Environment validation
validate-env:
	@echo "Validating environment..."
	@command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed"; exit 1; }
	@command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed"; exit 1; }
	@command -v git >/dev/null 2>&1 || { echo "Git is required but not installed"; exit 1; }
	@echo "Environment validation passed!"

# Performance benchmarks
benchmark:
	@echo "Running performance benchmarks..."
	npm run test:performance

# Bundle analysis
analyze-bundle:
	npm run build
	@echo "Analyzing bundle size..."
	du -sh dist/
	find dist/ -name "*.js" -exec du -h {} + | sort -rh | head -10
