#!/usr/bin/env bash

set -e

echo "Running demo-app-frontend with the following configuration:"
echo "Backend URL:        $BACKEND_URL"

if [ -z "$BACKEND_URL" ]
then
  echo "ERROR! INVALID CONFIGURATION: BACKEND_URL must be defined in the environment. Exiting."
  exit 1
fi

# Use semicolons instead of slashes as delimiters for sed, to prevent any conflicts with the slashes in the URL params:
# https://unix.stackexchange.com/questions/379572/escaping-both-forward-slash-and-back-slash-with-sed
sed -i "s;%REACT_APP_BACKEND_URL%;${BACKEND_URL};" /var/www/webapp/index.html
sed -i "s;%REACT_APP_SANDBOX_SDK%;${SANDBOX_SDK};" /var/www/webapp/index.html

# Call the command that the base image was initally supposed to run
# See: XXX
nginx -g "daemon off;"
