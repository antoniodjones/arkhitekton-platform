#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Initializing Arkhitekton Development Environment...${NC}"

# Check if cloud-sql-proxy is installed
if ! command -v cloud-sql-proxy &> /dev/null; then
    echo -e "${RED}❌ Error: cloud-sql-proxy is not installed or not in your PATH.${NC}"
    echo "Please install it first:"
    echo "  curl -o /usr/local/bin/cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.14.1/cloud-sql-proxy.darwin.arm64"
    echo "  chmod +x /usr/local/bin/cloud-sql-proxy"
    exit 1
fi

# Kill any existing process on port 5433 (Postgres proxy)
if lsof -ti:5433 > /dev/null; then
    echo -e "${YELLOW}🧹 Cleaning up old database proxy...${NC}"
    lsof -ti:5433 | xargs kill -9
fi

# Kill any existing process on port 5001 (App server)
if lsof -ti:5001 > /dev/null; then
    echo -e "${YELLOW}🧹 Cleaning up old app server...${NC}"
    lsof -ti:5001 | xargs kill -9
fi

# Start Cloud SQL Proxy in the background
echo -e "${GREEN}🔌 Connecting to Cloud SQL (arkhitekton-db-dev)...${NC}"
cloud-sql-proxy --port 5433 lucid-access-479823-u3:us-central1:arkhitekton-db-dev > /dev/null 2>&1 &
PROXY_PID=$!

# Wait for proxy to initialize (give it 3 seconds)
echo -e "${YELLOW}⏳ Waiting for database connection...${NC}"
sleep 3

# Check if proxy is actually running
if ! ps -p $PROXY_PID > /dev/null; then
    echo -e "${RED}❌ Database proxy failed to start.${NC}"
    echo "Check your Google Cloud credentials: 'gcloud auth application-default login'"
    exit 1
fi

echo -e "${GREEN}✅ Database Connected!${NC}"
echo -e "${GREEN}🚀 Starting App Server...${NC}"
echo -e "${YELLOW}(Press Ctrl+C to stop both App and Database)${NC}"
echo "---------------------------------------------------"

# Function to kill proxy when script exits
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down...${NC}"
    kill $PROXY_PID 2>/dev/null
    echo -e "${GREEN}👋 Bye!${NC}"
    exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

# Start the Node app
npm run dev

