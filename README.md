# Pi Demo App

https://github.com/Munawarmoja/demo
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




Frontend Javascript SDK

The JS SDK is the frontend SDK, designed to be used in your HTML pages or Single-Page Apps, served in the Pi Browser.

In order to enable the SDK to function correctly, you need to declare your apps on the Developer Portal (open
develop.pi in the Pi Browser to access the Developer Portal).

This SDK is not for a server-side NodeJS app.


In order to make sure that all involved parties (your app, your server, the Pi servers, and the Pi Blockchain) are in sync,
the payment needs to go through a Server-Side Approval flow (for User-to-App payment) and/or a Server-Side Completion
flow (for all types of payments).

Please refer to:
* [the full Payments documentation](./payments.md) to learn about the complete payment flow
* [the Advanced Payments documentation](./payments_advanced.md) to learn about App-to-User payment flow
* [the Platform API documentation](./platform_API.md) to learn how to confirm the payment and acknowledge it from your
  server
* [the client SDK documentation](./SDK_reference.md) to learn about Pi Apps SDK and provided methods in detail
* [the Demo App](https://github.com/pi-apps/demo) to view an example of how you can implement the various required flows in your app's code


# WARNING: Commenting after a variable's value DOES NOT WORK in .env files.
# In other words, don't to this: `FOO=value # this is a comment`.
# This would give the value "value # this is a comment" to the FOO variable.
# You need to use single-line comments instead, e.g:
# ```
#   # this is a comment:
#   FOO=value
# ```
#
#
#

# Frontend app URL and bare domain name:
FRONTEND_URL=https://frontend.example.com
FRONTEND_DOMAIN_NAME=frontend.example.com

# Backend app URL and bare domain name:
BACKEND_URL=https://backend.example.com
BACKEND_DOMAIN_NAME=backend.example.com


# Obtain the following 2 values on the Pi Developer Portal (open develop.pi in the Pi Browser).

# Domain validation key:
https://github.munawarmoja.com/validation-key.txtb326b315d412570cbfa80e810e6f069e364b65eef8374a4c995264501110d518a8455d30c753c197f3aae087db225fe9f051b3080293ba45be3c0aa6b7b76435f6e156bb951c8883117f9b3a26e895fc82b6b264c9cf49f3922a3f2ab36282fcc460889388b307f90018d834b02b9c7582529014233b75a18806041b3cac821
DOMAIN_VALIDATION_KEY=todo_developer_portal
# Pi Platform API Key:
PI_API_KEY=todo_developer_portal

# Generate a random string, or roll your face on the keyboard to fill this value:
SESSION_SECRET=abcd1324_TODO

# MongoDB database connection details:
MONGODB_DATABASE_NAME=demoapp
MONGODB_USERNAME=demoapp
MONGODB_PASSWORD=abcd1234


# This will be prepended to all container names.
# Changing this will make docker-compose lose track of all your containers.
# Run `docker-compose down` before changing it.
COMPOSE_PROJECT_NAME=pi-demo-app

# Set this to either "development" or "production" (XXX "staging"?):
ENVIRONMENT=production

# This directory will be used to store all persistent data needed by Docker (using volumes):
DATA_DIRECTORY=./docker-data

# URL of the Pi Platform API - you should not need to change this.
PLATFORM_API_URL=https://api.minepi.com