#!/bin/sh
set -e

echo "Running Vite React frontend with the following configuration:"
echo "Backend URL:        $BACKEND_URL"
echo "App wallet address: $APP_WALLET_ADDRESS"

# Mirrors utils/subscriptionAudience.ts: only "everyone" (any case, surrounding spaces trimmed) opens the club to
# all users. The page gets the cleaned value, never the raw one, so nothing typed here can break its script.
AUDIENCE_NORMALIZED=$(printf '%s' "$SUBSCRIPTION_AUDIENCE" | tr '[:upper:]' '[:lower:]' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')
case "$AUDIENCE_NORMALIZED" in
  everyone) EFFECTIVE_AUDIENCE=everyone ;;
  core_team|"") EFFECTIVE_AUDIENCE=core_team ;;
  *)
    echo "WARNING: unknown SUBSCRIPTION_AUDIENCE '$SUBSCRIPTION_AUDIENCE', using core_team."
    EFFECTIVE_AUDIENCE=core_team
    ;;
esac
echo "Subscription audience: $EFFECTIVE_AUDIENCE"

if [ -z "$BACKEND_URL" ]; then
  echo "ERROR! INVALID CONFIGURATION: BACKEND_URL must be defined."
  exit 1
fi

# Replace placeholders in /var/www/webapp/index.html at runtime
# Use semicolons to avoid conflicts with slashes in URLs
sed -i 's;\$\$BACKEND_URL\$\$;'"${BACKEND_URL}"';g' /var/www/webapp/index.html
sed -i 's;\$\$APP_WALLET_ADDRESS\$\$;'"${APP_WALLET_ADDRESS}"';g' /var/www/webapp/index.html
sed -i 's;\$\$SUBSCRIPTION_AUDIENCE\$\$;'"${EFFECTIVE_AUDIENCE}"';g' /var/www/webapp/index.html

# Start nginx
nginx -g "daemon off;"
