##
## BUILDER
##
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (cache-friendly)
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  else npm install; \
  fi

# Copy source
COPY . .

# Build Vite app
RUN npm run build || yarn build || pnpm build

# We have set GENERATE_SOURCEMAP=false in our build script but we're doing this to add an extra layer
# of safety - we want to keep JS source maps from getting deployed on the production servers:
RUN rm -rf ./dist/assets/*.map


##
## RUNNER
##
FROM nginx:1.25-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY docker/entrypoint.sh /var/entrypoint.sh
RUN chmod +x /var/entrypoint.sh

# Copy built app (Vite outputs to /dist)
COPY --from=builder /app/dist /var/www/webapp

# Optional: better defaults
RUN sed -i 's/worker_processes  1/worker_processes auto/' /etc/nginx/nginx.conf

EXPOSE 80

CMD ["/var/entrypoint.sh"]
