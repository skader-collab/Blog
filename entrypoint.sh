#!/usr/bin/env bash
set -e

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Collect static files if configured
if [ -n "${COLLECT_STATIC:-}" ] || [ -f "staticfiles" ]; then
  echo "Collecting static files..."
  python manage.py collectstatic --noinput || true
fi

# Create admin user from env vars if provided
echo "Ensuring superuser exists (if ADMIN_USERNAME/ADMIN_PASSWORD set)..."
python manage.py create_admin || true

# Start the server (Railway expects the process to bind to $PORT)
PORT=${PORT:-8000}
echo "Starting server on port ${PORT} using cross-platform launcher..."
# Use the cross-platform Python launcher which runs Gunicorn on Linux and Waitress on Windows
exec python -u start_server.py
