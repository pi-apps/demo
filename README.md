

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

