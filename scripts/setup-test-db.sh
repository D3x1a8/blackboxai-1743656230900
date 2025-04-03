#!/bin/bash

# Start PostgreSQL container if not running
if [ ! "$(docker ps -q -f name=test-postgres)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=test-postgres)" ]; then
        docker rm test-postgres
    fi
    docker run --name test-postgres \
        -e POSTGRES_USER=testuser \
        -e POSTGRES_PASSWORD=testpassword \
        -e POSTGRES_DB=test_notifications \
        -p 5432:5432 \
        -d postgres:13
fi

# Wait for PostgreSQL to be ready
until docker exec test-postgres pg_isready -U testuser; do
    echo "Waiting for PostgreSQL to start..."
    sleep 1
done

# Run migrations
docker exec -i test-postgres psql -U testuser -d test_notifications < server/migrations/003_notifications_schema.sql

echo "Test database setup complete"