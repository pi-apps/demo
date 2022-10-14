##
## BUILDER CONTAINER
##

FROM node:12.20.0 as builder

RUN mkdir /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

WORKDIR /app

RUN yarn install

# Copy the resources needed to build the app
# We could copy ./ but it weigh more and bust cache more often
COPY ./src /app/src
COPY ./public /app/public
COPY ./tsconfig.json /app/tsconfig.json

RUN NODE_PATH=./src yarn build

# We have set GENERATE_SOURCEMAP=false in our build script but we're doing this to add an extra layer
# of safety - we want to keep JS source maps from getting deployed on the production servers:
RUN rm -rf ./build/static/js/*.map

##
## RUNNER CONTAINER
##

FROM nginx:1.15.7

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./docker/entrypoint.sh /var/entrypoint.sh
RUN chmod +x /var/entrypoint.sh

RUN mkdir -p /var/www/webapp

COPY --from=builder /app/build /var/www/webapp

# Default nginx configuration has only one worker process running. "Auto" is a better setting.
# Commenting out any existing setting, and adding the desired one is more robust against new docker image versions.
RUN sed -i  "s/worker_processes/#worker_processes/" /etc/nginx/nginx.conf && \
    echo "worker_processes auto;" >> /etc/nginx/nginx.conf && \
    echo "worker_rlimit_nofile 16384;" >> /etc/nginx/nginx.conf

# Override the default command of the base image:
# See: https://github.com/nginxinc/docker-nginx/blob/1.15.7/mainline/stretch/Dockerfile#L99
CMD ["/var/entrypoint.sh"]
