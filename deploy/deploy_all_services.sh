#!/bin/bash

# SOL eMenu Platform Deployment Script
# Manages all services: Directus API, eMenu Web Application, and Nginx

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ECOSYSTEM_FILE="/Users/dev/code/emenu-kore/deploy/ecosystem.config.js"
LOG_DIR="/Users/dev/code/emenu-kore/logs"
EMENU_WEB_DIR="/Users/dev/code/emenu-kore/web-emenu"

# Environment
ENVIRONMENT=${1:-development}

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create logs directory
create_log_dir() {
    if [ ! -d "$LOG_DIR" ]; then
        mkdir -p "$LOG_DIR"
        log_info "Created logs directory: $LOG_DIR"
    fi
}

# Stop existing services
stop_services() {
    log_info "Stopping existing services..."

    # Stop any process on port 3520 (eMenu web)
    EMENU_PID=$(lsof -ti:3520 2>/dev/null || true)
    if [ ! -z "$EMENU_PID" ]; then
        log_info "Stopping eMenu web process (PID: $EMENU_PID)"
        kill -TERM $EMENU_PID 2>/dev/null || true
        sleep 2
        kill -KILL $EMENU_PID 2>/dev/null || true
    fi

    # Stop PM2 processes
    if command -v pm2 &> /dev/null; then
        pm2 stop all 2>/dev/null || true
        pm2 delete all 2>/dev/null || true
    fi

    log_success "All services stopped"
}

# Build eMenu web application
build_emenu_web() {
    log_info "Building eMenu web application..."

    cd "$EMENU_WEB_DIR"

    # Install dependencies
    npm install

    # Build for production if environment is production
    if [ "$ENVIRONMENT" = "production" ]; then
        npm run build
        log_success "eMenu web application built for production"
    else
        log_success "eMenu web application dependencies installed"
    fi
}

# Start services
start_services() {
    log_info "Starting SOL eMenu platform services..."

    # Start services with PM2
    if [ "$ENVIRONMENT" = "production" ]; then
        pm2 start "$ECOSYSTEM_FILE" --env production
    else
        pm2 start "$ECOSYSTEM_FILE" --env development
    fi

    # Save PM2 configuration
    pm2 save

    log_success "Services started successfully"
}

# Check service health
check_health() {
    log_info "Checking service health..."

    # Wait a moment for services to start
    sleep 5

    # Check eMenu web (port 3520)
    if curl -s http://localhost:3520/health > /dev/null 2>&1; then
        log_success "eMenu web service is healthy (port 3520)"
    else
        log_warning "eMenu web service may not be ready yet"
    fi

    # Check Directus API (port 11111)
    if curl -s http://localhost:11111/health > /dev/null 2>&1; then
        log_success "Directus API service is healthy (port 11111)"
    else
        log_warning "Directus API service may not be ready yet"
    fi
}

# Show service status
show_status() {
    log_info "Service status:"
    pm2 status

    echo ""
    log_info "Port usage:"
    echo "eMenu Web: http://localhost:3520"
    echo "Directus API: http://localhost:11111"

    if [ "$ENVIRONMENT" = "production" ]; then
        echo "Production URLs:"
        echo "eMenu Web: https://em.sol.com.vn"
        echo "Directus Admin: https://kore.sol.com.vn/admin"
    else
        echo "Development URLs:"
        echo "eMenu Web: https://sol-emenu.alphabits.team"
        echo "Directus Admin: https://sol-kore.alphabits.team/admin"
    fi
}

# Cleanup function
cleanup() {
    log_info "Performing cleanup..."
    # Add any cleanup tasks here
}

# Main deployment function
deploy() {
    log_info "Starting SOL eMenu platform deployment..."
    log_info "Environment: $ENVIRONMENT"

    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        log_error "PM2 is not installed. Please install PM2 first:"
        echo "npm install -g pm2"
        exit 1
    fi

    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi

    # Create necessary directories
    create_log_dir

    # Stop existing services
    stop_services

    # Build applications
    build_emenu_web

    # Start services
    start_services

    # Check health
    check_health

    # Show status
    show_status

    log_success "SOL eMenu platform deployment completed successfully!"
}

# Help function
show_help() {
    echo "SOL eMenu Platform Deployment Script"
    echo ""
    echo "Usage: $0 [ENVIRONMENT]"
    echo ""
    echo "Environments:"
    echo "  development (default) - Development environment"
    echo "  production          - Production environment"
    echo ""
    echo "Commands:"
    echo "  $0 development      - Deploy to development environment"
    echo "  $0 production       - Deploy to production environment"
    echo "  $0 help             - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                  # Deploy to development"
    echo "  $0 production       # Deploy to production"
    echo ""
}

# Signal handlers
trap cleanup EXIT
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Main script logic
case "${1:-}" in
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        deploy
        ;;
esac