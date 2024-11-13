# Pi Demo App

Pi Demo App is an example of how you can implement the various required flows in your app's code.
It aims to show you how to use Pi Platform API on the backend side and Pi SDK on the frontend side of your app.


It is composed of two major parts:

* **backend**: a backend app (a very simple JSON API built using Node and ExpressJS)
* **frontend**: a single-page frontend app (built using React and create-react-app)


Read [`doc/development.md`](./doc/development.md) to get started and learn how to run this app in development.

> **WARNING**
>
> The demo app uses express session cookies which, in the Sandbox environment, are not correctly saved on the client on some browsers.
> To properly test all of the features of the Demo App, we recommend you to open the sandbox app using Mozilla Firefox.


## Deployment

Read [`doc/deployment.md`](./doc/deployment.md) to learn how to deploy this app on a server using Docker and docker-compose.


## Flows

To dive into the implementation of the flows that support the demo app features, please refer to
[Pi Demo App Flows](./FLOWS.md).







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



