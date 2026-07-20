#!/bin/sh
set -e

echo "Running Vite React frontend with the following configuration:"
echo "Backend URL:        $BACKEND_URL"

if [ -z "$BACKEND_URL" ]; then
  echo "ERROR! INVALID CONFIGURATION: BACKEND_URL must be defined."
  exit 1
fi

# Replace placeholders in /var/www/webapp/index.html at runtime
# Use semicolons to avoid conflicts with slashes in URLs
sed -i 's;\$\$BACKEND_URL\$\$;'"${BACKEND_URL}"';g' /var/www/webapp/index.html

# Start nginx
nginx -g "daemon off;"
