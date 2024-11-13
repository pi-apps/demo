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



// Authenticate the user, and get permission to request payments from them:
const scopes = ['payments'];

// Read more about this callback in the SDK reference:
function onIncompletePaymentFound(payment) { /* ... */ };

Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
  console.log(Hi there! You're ready to make payments!);
}).catch(function(error) {
  console.error(error);
});


<script src="https://sdk.minepi.com/pi-sdk.js"></script>
<script>Pi.init({ version: "2.0" })</script>



Pi.createPayment({
  // Amount of π to be paid:
  amount: 3.14,
  // An explanation of the payment - will be shown to the user:
  memo: "...", // e.g: "Digital kitten #1234",
  // An arbitrary developer-provided metadata object - for your own usage:
  metadata: { /* ... */ }, // e.g: { kittenId: 1234 }
}, {
  // Callbacks you need to implement - read more about those in the detailed docs linked below:
  onReadyForServerApproval: function(paymentId) { /* ... */ },
  onReadyForServerCompletion: function(paymentId, txid) { /* ... */ },
  onCancel: function(paymentId) { /* ... */ },
  onError: function(error, payment) { /* ... */ },
});

