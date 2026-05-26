#!/usr/bin/env bash

echo
echo "=================================================="
echo "reverse-proxy: Starting up!"
echo " - HTTPS: ${HTTPS}"
echo " - FRONTEND_DOMAIN_NAME: ${FRONTEND_DOMAIN_NAME}"
echo " - BACKEND_DOMAIN_NAME: ${BACKEND_DOMAIN_NAME}"
echo "=================================================="

set -e

# Directory used by certbot
mkdir -p /var/www/certbot

if [ "$HTTPS" = "true" ]; then
  echo "Starting in SSL mode"
  rm -f /etc/nginx/conf.d/default.conf
  
  # Stop nginx if running
  service nginx stop || true
  
  echo "Starting in HTTP mode for local development (SSL disabled)"
  envsubst '$FRONTEND_DOMAIN_NAME $BACKEND_DOMAIN_NAME $DOMAIN_VALIDATION_KEY' < /nginx.conf.template > /etc/nginx/conf.d/default.conf
else
  echo "Starting in HTTP mode (Local Development)"
  envsubst '$FRONTEND_DOMAIN_NAME $BACKEND_DOMAIN_NAME $DOMAIN_VALIDATION_KEY' < /nginx.conf.template > /etc/nginx/conf.d/default.conf
fi

echo "Starting Nginx..."
nginx -g "daemon off;"