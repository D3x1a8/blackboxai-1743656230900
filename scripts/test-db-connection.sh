#!/bin/bash

# Test database connection using psql if available
if command -v psql &> /dev/null; then
    psql -U testuser -d test_notifications -h localhost -c "SELECT 1" >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "Database connection successful"
        exit 0
    fi
fi

# Fallback to Docker check
if docker ps | grep -q test-postgres; then
    echo "Database connection successful (Docker)"
    exit 0
fi

echo "Database connection failed - using mock API"
exit 1