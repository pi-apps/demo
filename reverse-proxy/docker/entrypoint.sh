#!/usr/bin/env bash

echo; echo
echo "reverse-proxy: Starting up!"
echo "  - HTTPS: ${HTTPS}"
echo "  - FRONTEND_DOMAIN_NAME: ${FRONTEND_DOMAIN_NAME}"
echo "  - BACKEND_DOMAIN_NAME: ${BACKEND_DOMAIN_NAME}"

set -e

# Directory used by certbot to serve certificate requests challenges:
mkdir -p /var/www/certbot

if [ $HTTPS = "true" ]; then
  echo "Starting in SSL mode"

  rm /etc/nginx/conf.d/default.conf

  echo
  echo "Obtaining SSL certificate for frontend domain name: ${FRONTEND_DOMAIN_NAME}"
  certbot certonly --noninteractive --agree-tos --register-unsafely-without-email --nginx -d ${FRONTEND_DOMAIN_NAME}

  echo
  echo "Obtaining SSL certificate for backend domain name: ${BACKEND_DOMAIN_NAME}"
  certbot certonly --noninteractive --agree-tos --register-unsafely-without-email --nginx -d ${BACKEND_DOMAIN_NAME}

  # The above certbot command will start the nginx service in the background as a service.
  # However, we need the `nginx -g "daemon off;"` to be the main nginx process running on the container, and
  # we need it to be able to start listening on ports 80/443. If we don't stop the nginx process here, we'll
  # encounter the following error: `nginx: [emerg] bind() to 0.0.0.0:443 failed (98: Address already in use)`.
  service nginx stop

  envsubst '$FRONTEND_DOMAIN_NAME $BACKEND_DOMAIN_NAME $DOMAIN_VALIDATION_KEY' < /nginx-ssl.conf.template > /etc/nginx/conf.d/default.conf
else
  echo "Starting in http mode"
  envsubst '$FRONTEND_DOMAIN_NAME $BACKEND_DOMAIN_NAME $DOMAIN_VALIDATION_KEY' < /nginx.conf.template > /etc/nginx/conf.d/default.conf
fi

# Call the command that the base image was initally supposed to run
# See: XXX
nginx -g "daemon off;"
