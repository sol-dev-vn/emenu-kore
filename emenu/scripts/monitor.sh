#!/bin/bash

# EMENU Monitoring Script
# Provides comprehensive monitoring and health checks

set -e

APP_NAME="emenu"
APP_DIR="/Users/dev/code/emenu-kore/emenu"
LOG_DIR="$APP_DIR/logs"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Health check function
health_check() {
    echo -e "${BLUE}🔍 Performing health check...${NC}"

    # Check if PM2 process is running
    if pm2 list | grep -q "$APP_NAME.*online"; then
        echo -e "${GREEN}✅ PM2 process is online${NC}"

        # Check memory usage
        MEMORY_USAGE=$(pm2 show "$APP_NAME" | grep "memory usage" | awk '{print $4, $5}')
        echo -e "${GREEN}📊 Memory usage: $MEMORY_USAGE${NC}"

        # Check CPU usage
        CPU_USAGE=$(pm2 show "$APP_NAME" | grep "CPU usage" | awk '{print $3}')
        echo -e "${GREEN}💻 CPU usage: $CPU_USAGE${NC}"

        # Check uptime
        UPTIME=$(pm2 show "$APP_NAME" | grep "up time" | cut -d':' -f2- | xargs)
        echo -e "${GREEN}⏱️  Uptime: $UPTIME${NC}"

        # Check if application is responding
        if curl -f -s http://localhost:3520 > /dev/null; then
            echo -e "${GREEN}🌐 Application is responding on port 3520${NC}"
        else
            echo -e "${RED}❌ Application is not responding on port 3520${NC}"
        fi

        # Check external URL
        if curl -f -s https://sol-menu.alphabits.team > /dev/null; then
            echo -e "${GREEN}🌍 External URL is accessible${NC}"
        else
            echo -e "${YELLOW}⚠️  External URL (https://sol-menu.alphabits.team) is not accessible${NC}"
        fi

    else
        echo -e "${RED}❌ PM2 process is not running${NC}"
        return 1
    fi
}

# Recent errors function
recent_errors() {
    echo -e "${BLUE}📝 Recent errors (last 50 lines):${NC}"
    if [ -f "$LOG_DIR/error.log" ]; then
        tail -n 50 "$LOG_DIR/error.log" | grep -E "(ERROR|error|Error)" || echo -e "${GREEN}✅ No recent errors found${NC}"
    else
        echo -e "${YELLOW}⚠️  Error log file not found${NC}"
    fi
}

# Log analysis function
analyze_logs() {
    echo -e "${BLUE}📊 Log Analysis (last 24 hours):${NC}"

    # Error count
    if [ -f "$LOG_DIR/error.log" ]; then
        ERROR_COUNT=$(grep -c "$(date '+%Y-%m-%d')" "$LOG_DIR/error.log" 2>/dev/null || echo "0")
        echo -e "${YELLOW}📈 Errors today: $ERROR_COUNT${NC}"
    fi

    # Recent restarts
    RESTART_COUNT=$(pm2 show "$APP_NAME" | grep "restart time" | wc -l)
    echo -e "${YELLOW}🔄 Restarts: $RESTART_COUNT${NC}"

    # Memory trend
    echo -e "${BLUE}📈 Memory trend (last 5 checks):${NC}"
    pm2 monit --no-daemon --silent | head -n 20 | grep "$APP_NAME" | tail -n 5 || echo -e "${YELLOW}⚠️  Unable to get memory trend${NC}"
}

# System resources function
system_resources() {
    echo -e "${BLUE}💻 System Resources:${NC}"

    # CPU usage
    CPU_USAGE=$(top -l 1 -n 0 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')
    echo -e "${GREEN}🖥️  System CPU: ${CPU_USAGE}%${NC}"

    # Memory usage
    MEMORY_INFO=$(top -l 1 -n 0 | grep "PhysMem")
    FREE_MEMORY=$(echo $MEMORY_INFO | awk '{print $6}')
    USED_MEMORY=$(echo $MEMORY_INFO | awk '{print $2}')
    echo -e "${GREEN}🧠 Memory: ${USED_MEMORY} used, ${FREE_MEMORY} free${NC}"

    # Disk space
    DISK_USAGE=$(df -h "$APP_DIR" | tail -1 | awk '{print $5}')
    echo -e "${GREEN}💾 Disk usage: ${DISK_USAGE}${NC}"

    # Node processes
    NODE_PROCESSES=$(ps aux | grep "node" | grep -v grep | wc -l)
    echo -e "${GREEN}🟢 Node.js processes: $NODE_PROCESSES${NC}"
}

# Performance metrics function
performance_metrics() {
    echo -e "${BLUE}⚡ Performance Metrics:${NC}"

    # Application response time
    if command -v curl &> /dev/null; then
        RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3520 || echo "N/A")
        echo -e "${GREEN}⏱️  Response time: ${RESPONSE_TIME}s${NC}"
    fi

    # HTTP status check
    HTTP_STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3520 || echo "N/A")
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}🌐 HTTP Status: $HTTP_STATUS (OK)${NC}"
    else
        echo -e "${RED}🌐 HTTP Status: $HTTP_STATUS (ERROR)${NC}"
    fi
}

# Alert function
check_alerts() {
    local alerts=()

    # Check if process is running
    if ! pm2 list | grep -q "$APP_NAME.*online"; then
        alerts+=("❌ Application is not running")
    fi

    # Check memory usage (alert if >80%)
    MEMORY_USAGE=$(pm2 show "$APP_NAME" | grep "memory usage" | awk '{print $4}' | sed 's/MB//')
    if [ "$MEMORY_USAGE" -gt 800 ]; then
        alerts+=("⚠️  High memory usage: ${MEMORY_USAGE}MB")
    fi

    # Check if responding
    if ! curl -f -s http://localhost:3520 > /dev/null; then
        alerts+=("❌ Application not responding")
    fi

    # Check for recent errors
    if [ -f "$LOG_DIR/error.log" ]; then
        RECENT_ERRORS=$(tail -n 100 "$LOG_DIR/error.log" | grep -c "$(date '+%Y-%m-%d')" || echo "0")
        if [ "$RECENT_ERRORS" -gt 10 ]; then
            alerts+=("⚠️  High error rate: $RECENT_ERRORS errors today")
        fi
    fi

    # Display alerts
    if [ ${#alerts[@]} -gt 0 ]; then
        echo -e "${RED}🚨 ALERTS:${NC}"
        for alert in "${alerts[@]}"; do
            echo -e "${RED}  $alert${NC}"
        done
    else
        echo -e "${GREEN}✅ No alerts - All systems normal${NC}"
    fi
}

# Main function
main() {
    echo -e "${BLUE}🔍 EMENU System Monitor${NC}"
    echo "=================================="
    echo "Time: $(date)"
    echo ""

    health_check
    echo ""

    check_alerts
    echo ""

    performance_metrics
    echo ""

    system_resources
    echo ""

    if [ "$1" = "--verbose" ]; then
        analyze_logs
        echo ""
        recent_errors
    fi

    echo ""
    echo -e "${BLUE}📋 Quick Commands:${NC}"
    echo "  pm2 status $APP_NAME          - Check PM2 status"
    echo "  pm2 logs $APP_NAME             - View logs"
    echo "  pm2 restart $APP_NAME          - Restart application"
    echo "  ./scripts/monitor.sh --verbose - Detailed analysis"
}

# Handle command line arguments
case "$1" in
    --health-only)
        health_check
        ;;
    --errors)
        recent_errors
        ;;
    --performance)
        performance_metrics
        ;;
    --resources)
        system_resources
        ;;
    --alerts)
        check_alerts
        ;;
    --verbose)
        main --verbose
        ;;
    *)
        main
        ;;
esac