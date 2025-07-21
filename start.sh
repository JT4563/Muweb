#!/bin/bash

# CodeCrafter Startup Script
# This script helps you get CodeCrafter up and running quickly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

print_color $BLUE "🚀 CodeCrafter Startup Script"
print_color $BLUE "================================"

# Check if .env file exists
if [ ! -f .env ]; then
    print_color $YELLOW "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    print_color $GREEN "✅ .env file created. Please edit it with your configuration."
    print_color $YELLOW "   You may need to update database URLs and secrets."
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    print_color $YELLOW "📦 Installing dependencies..."
    npm install
    print_color $GREEN "✅ Dependencies installed."
fi

# Function to check if a service is running
check_service() {
    local service=$1
    local port=$2
    local name=$3
    
    if nc -z localhost $port 2>/dev/null; then
        print_color $GREEN "✅ $name is running on port $port"
        return 0
    else
        print_color $RED "❌ $name is not running on port $port"
        return 1
    fi
}

# Check required services
print_color $BLUE "🔍 Checking required services..."

MONGODB_RUNNING=false
REDIS_RUNNING=false
RABBITMQ_RUNNING=false

if check_service "mongodb" 27017 "MongoDB"; then
    MONGODB_RUNNING=true
fi

if check_service "redis" 6379 "Redis"; then
    REDIS_RUNNING=true
fi

if check_service "rabbitmq" 5672 "RabbitMQ"; then
    RABBITMQ_RUNNING=true
fi

# Prompt user for startup method
echo
print_color $BLUE "Choose how to start CodeCrafter:"
echo "1) 🐳 Start with Docker Compose (recommended)"
echo "2) 🔧 Start in development mode (requires services running)"
echo "3) 👷 Start only workers"
echo "4) 🚪 Exit"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_color $BLUE "🐳 Starting with Docker Compose..."
        
        # Check if Docker is running
        if ! docker info >/dev/null 2>&1; then
            print_color $RED "❌ Docker is not running. Please start Docker and try again."
            exit 1
        fi
        
        # Build and start services
        print_color $YELLOW "Building Docker images..."
        docker-compose build
        
        print_color $YELLOW "Starting all services..."
        docker-compose up -d
        
        print_color $GREEN "✅ All services started!"
        print_color $BLUE "📊 Service URLs:"
        echo "   • Application: http://localhost:5000"
        echo "   • Health Check: http://localhost:5000/health"
        echo "   • Metrics: http://localhost:5000/metrics"
        echo "   • RabbitMQ Management: http://localhost:15672"
        echo "   • Grafana: http://localhost:3001"
        
        print_color $YELLOW "📜 To view logs: docker-compose logs -f"
        print_color $YELLOW "🛑 To stop: docker-compose down"
        ;;
        
    2)
        print_color $BLUE "🔧 Starting in development mode..."
        
        # Check if all services are running
        if [ "$MONGODB_RUNNING" = false ] || [ "$REDIS_RUNNING" = false ] || [ "$RABBITMQ_RUNNING" = false ]; then
            print_color $RED "❌ Not all required services are running."
            print_color $YELLOW "Please start the missing services or use Docker Compose option."
            
            if [ "$MONGODB_RUNNING" = false ]; then
                echo "   To start MongoDB: mongod --dbpath /data/db"
            fi
            
            if [ "$REDIS_RUNNING" = false ]; then
                echo "   To start Redis: redis-server"
            fi
            
            if [ "$RABBITMQ_RUNNING" = false ]; then
                echo "   To start RabbitMQ: rabbitmq-server"
            fi
            
            exit 1
        fi
        
        print_color $GREEN "✅ All services are running!"
        
        # Create logs directory
        mkdir -p logs
        
        print_color $BLUE "🚀 Starting CodeCrafter in development mode..."
        
        # Start the application
        npm run dev
        ;;
        
    3)
        print_color $BLUE "👷 Starting workers only..."
        
        if [ "$MONGODB_RUNNING" = false ] || [ "$REDIS_RUNNING" = false ] || [ "$RABBITMQ_RUNNING" = false ]; then
            print_color $RED "❌ Not all required services are running."
            exit 1
        fi
        
        print_color $GREEN "✅ Starting code execution workers..."
        npm run worker
        ;;
        
    4)
        print_color $BLUE "👋 Goodbye!"
        exit 0
        ;;
        
    *)
        print_color $RED "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
