#!/bin/bash

# EMENU Production Deployment Script
# This script deploys the application using PM2

set -e  # Exit on any error

echo "🚀 Starting EMENU Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="emenu"
APP_DIR="/Users/dev/code/emenu-kore/emenu"
LOG_DIR="$APP_DIR/logs"

echo -e "${YELLOW}📁 Working directory: $APP_DIR${NC}"
echo -e "${YELLOW}📝 Log directory: $LOG_DIR${NC}"

# Function to check if PM2 is installed
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        echo -e "${RED}❌ PM2 is not installed. Installing PM2 globally...${NC}"
        npm install -g pm2
    else
        echo -e "${GREEN}✅ PM2 is installed${NC}"
    fi
}

# Function to create logs directory
create_logs_dir() {
    if [ ! -d "$LOG_DIR" ]; then
        echo -e "${YELLOW}📁 Creating logs directory...${NC}"
        mkdir -p "$LOG_DIR"
    else
        echo -e "${GREEN}✅ Logs directory exists${NC}"
    fi
}

# Function to stop existing application
stop_app() {
    echo -e "${YELLOW}🛑 Stopping existing application...${NC}"
    cd "$APP_DIR"
    pm2 stop "$APP_NAME" 2>/dev/null || echo -e "${YELLOW}⚠️  No existing process to stop${NC}"
    pm2 delete "$APP_NAME" 2>/dev/null || echo -e "${YELLOW}⚠️  No existing process to delete${NC}"
}

# Function to install dependencies
install_dependencies() {
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    cd "$APP_DIR"
    npm ci --production
}

# Function to build application
build_app() {
    echo -e "${YELLOW}🔨 Building application...${NC}"
    cd "$APP_DIR"
    npm run build
}

# Function to start application with PM2
start_app() {
    echo -e "${YELLOW}🚀 Starting application with PM2...${NC}"
    cd "$APP_DIR"

    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        echo -e "${RED}❌ .env.production file not found! Please create it first.${NC}"
        exit 1
    fi

    # Start with PM2
    pm2 start ecosystem.config.cjs --env production

    # Save PM2 configuration
    pm2 save

    echo -e "${GREEN}✅ Application started successfully${NC}"
}

# Function to verify deployment
verify_deployment() {
    echo -e "${YELLOW}🔍 Verifying deployment...${NC}"

    # Wait a moment for the app to start
    sleep 5

    # Check if the process is running
    if pm2 list | grep -q "$APP_NAME.*online"; then
        echo -e "${GREEN}✅ Application is running${NC}"
    else
        echo -e "${RED}❌ Application failed to start${NC}"
        pm2 logs "$APP_NAME" --lines 20
        exit 1
    fi

    # Check if the port is responding
    if curl -f http://localhost:3520 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Application is responding on port 3520${NC}"
    else
        echo -e "${YELLOW}⚠️  Application is running but not responding on port 3520 (may still be starting)${NC}"
    fi
}

# Function to show status
show_status() {
    echo -e "${YELLOW}📊 Application Status:${NC}"
    pm2 status "$APP_NAME"
    echo ""
    echo -e "${YELLOW}📝 Recent Logs:${NC}"
    pm2 logs "$APP_NAME" --lines 10 --nostream
}

# Main deployment process
main() {
    echo -e "${GREEN}🎯 EMENU Production Deployment${NC}"
    echo "=================================="

    check_pm2
    create_logs_dir
    stop_app
    install_dependencies
    build_app
    start_app
    verify_deployment
    show_status

    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo "📋 Useful Commands:"
    echo "  pm2 status                 - Show application status"
    echo "  pm2 logs $APP_NAME         - View application logs"
    echo "  pm2 restart $APP_NAME      - Restart application"
    echo "  pm2 stop $APP_NAME         - Stop application"
    echo "  pm2 monit                  - Monitor with PM2 monitoring"
    echo ""
    echo "🌐 Application URL: https://sol-menu.alphabits.team"
    echo "📊 PM2 Monitoring: pm2 monit"
}

# Handle script arguments
case "$1" in
    --stop)
        stop_app
        ;;
    --restart)
        stop_app
        start_app
        verify_deployment
        ;;
    --logs)
        pm2 logs "$APP_NAME"
        ;;
    --status)
        pm2 status "$APP_NAME"
        ;;
    --monit)
        pm2 monit
        ;;
    *)
        main
        ;;
esac