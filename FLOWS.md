# Pi Demo App Flows

- [Authentication](#authentication)
  - [`Pi.authenticate()`](#1-obtain-user-data-with-piauthenticate-sdk-method)
  - [`GET` `/me Platform API endpoint`](#2-verify-the-user-by-calling-pi-platform-api-get-me-endpoint)
- [Payments](#payments)
  - [`onReadyForServerApproval`](#1-onreadyforserverapproval)
  - [`onReadyForServerCompletion`](#2-onreadyforservercompletion)
  - [`onCancel`](#3-oncancel)
  - [`onError`](#4-onerror)
  - [`onIncompletePaymentFound`](#onincompletepaymentfound)

## Authentication

User authentication consists of two steps:

1. obtaining user `accessToken` using Pi SDK
2. verifying `accessToken` using Pi Platform API

<br />

> **Disclaimer:**
>
> **Pi SDK** method `Pi.authenticate()` should only be used to retrieve user `accessToken` and **MUST be verified on the backend side of your app**.
>
> For a detailed guide on how to use Pi SDK, please refer to [SDK Docs](https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md)
>
> **Pi Platform API** should remain the only source of truth about user data in your app (a malicious user could tamper with the requests and send you wrong data).
>
> For a detailed guide on how to use Pi Platform API, please refer to [Platform API Docs](https://github.com/pi-apps/pi-platform-docs/blob/master/platform_API.md)

<br />

### 1. Obtain user data with `Pi.authenticate()` SDK method

`Pi.authenticate()` method takes in two arguments: `scopes` and `onIncompletePaymentFound` and returns `AuthResult` object with different keys available.

`scopes` determine what keys are available on the `AuthResult` object. For full documentation on available scopes, please refer to [SDK Docs](https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md#scopes).

`onIncompletePaymentFound` is a function that connects both Authorization and Payments flows. To preview example implementation, proceed to [`onIncompletePaymentFound`](#onincompletepaymentfound) section.

```typescript
// frontend/src/shop/index.ts

const signIn = async () => {
  const scopes = ["username", "payments"];
  const authResponse = await window.Pi.authenticate(scopes, onIncompletePaymentFound);

  /* pass obtained data to backend */
  await signInUser(authResponse);

  /* use the obtained data however you want */
  setUser(authResponse.user);
};

const signInUser = (authResult: any) => {
  axiosClient.post("/signin", { authResult }, config);

  return setShowModal(false);
};
```

<br />

### 2. Verify the user by calling Pi Platform API `GET /me` endpoint

<br />

`GET /me` endpoint:

- uses `accessToken` as `Authorization` header
- returns [UserDTO](https://github.com/pi-apps/pi-platform-docs/blob/master/platform_API.md#UserDTO) object if the user was successfully authorized
- responds with status `401` if the user was not successfully authorized

<br />

```typescript
  // backend/src/index.ts

  app.post('/signin', async (req, res) => {
    try {
      /* verify with the user's access token */
      const me = await axiosClient.get(`/v2/me`, { headers: { 'Authorization': `Bearer ${currentUser.accessToken}` } });
      console.log(me);
    }
    catch (err) {
      console.error(err);
      return res.status(401).json({error: "User not authorized"});
    }
    return res.status(200).json({ message: "User signed in" });
  }
```

## Payments

To request a payment from the current user to your app's account, use the `Pi.createPayment()` SDK method, which accepts two arguments:

1. PaymentData object consists of three fields: [`amount`](https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md#amount), [`memo`](https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md#memo) and [`metadata`](https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md#metadata), from which `amount` and `memo` are required by Pi Platform API, while `metadata` is for your app use.
2. Callbacks object consisting of four callbacks:
   1. `onReadyForServerApproval`
   2. `onReadyForServerCompletion`
   3. `onCancel`
   4. `onError`

To learn more about `Pi.createPayment()` method and its arguments, please refer to [Pi SDK Docs](https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md#payments)

```typescript
// frontend/src/Shop/index.ts

const orderProduct = async (memo: string, amount: number, paymentMetadata: MyPaymentMetadata) => {
  if (user == null) {
    return setShowModal(true);
  }

  const paymentData = { amount: amount, memo: memo, metadata: paymentMetadata };
  const callbacks = {
    onReadyForServerApproval,
    onReadyForServerCompletion,
    onCancel,
    onError,
  };

  const payment = await window.Pi.createPayment(paymentData, callbacks);
  console.log("payment", payment);
};
```

### 1. `onReadyForServerApproval`

`onReadyForServerApproval` receives the payment identifier (`paymentId`) and should pass it to your app's backend for Server-Side approval.
It is called when the payment identifier (`paymentId`) is obtained from Pi Servers.

```typescript
// frontend/src/Shop/index.ts

const onReadyForServerApproval = (paymentId: string) => {
  console.log("onReadyForServerApproval", paymentId);
  axiosClient.post("/approve", { paymentId }, config);
};
```

On the backend side of your app make an API call to Pi Platform `POST /payments/:paymentId/approve` to approve payment on the Pi Servers.

```typescript
// backend/src/index.ts

app.post('/approve', async (req, res) => {
  ...
  const paymentId = req.body.paymentId;

  ...

  /* let Pi server know that you're ready */
  await axiosClient.post(`/v2/payments/${paymentId}/approve`, {}, config);
  return res.status(200).json({ message: `Approved the payment ${paymentId}` });
});
```

### 2. `onReadyForServerCompletion`

`onReadyForServerCompletion` receives payment identifier (`paymentId`) and blockchain transaction identifier (`txid`). You need this value for the Server-Side Completion flow.
It is called when the user has submitted the transaction to the Pi blockchain.

```typescript
// frontend/src/Shop/index.ts

const onReadyForServerCompletion = (paymentId: string, txid: string) => {
  console.log("onReadyForServerCompletion", paymentId, txid);
  axiosClient.post("/complete", { paymentId, txid }, config);
};
```

On the backend side of your app make an API call to Pi Platform `POST /payments/:paymentId/approve` to let Pi Servers know that payment has been completed.

```typescript
// backend/src/index.ts

app.post('/complete', async (req, res) => {
  const paymentId = req.body.paymentId;
  const txid = req.body.txid;

  ...

  /* let Pi server know that the payment is completed */
  await axiosClient.post(`/v2/payments/${paymentId}/complete`, { txid }, config);
  return res.status(200).json({ message: `Completed the payment ${paymentId}` });
});
```

### 3. `onCancel`

`onCancel` receives payment identifier (`paymentId`).
It is called when the payment is canceled - this can be triggered by a user action, programmatically or automatically if your app's backend doesn't approve the payment within 60 seconds.

```typescript
// frontend/src/Shop/index.ts

const onCancel = (paymentId: string) => {
  console.log("onCancel", paymentId);
  return axiosClient.post("/cancelled_payment", { paymentId }, config);
};
```

### 4. `onError`

`onError` receives Error Object (`error`) and Payment DTO (`payment`).
It is called when an error occurs and the payment cannot be made.
If the payment has been created, the second argument will be present and you may use it to investigate the error.
Otherwise, only the first argument will be provided.

`onError` callback is provided for informational purposes only and doesn't need to be passed and handled on the backend side of your app.

```typescript
// frontend/src/Shop/index.ts

const onError = (error: Error, payment?: PaymentDTO) => {
  console.log("onError", error);
  if (payment) {
    console.log(payment);
    /* handle the error accordingly */
  }
};
```

### `onIncompletePaymentFound`

`onIncompletePaymentFound` connects both Authentication and Payment flows. It is the second argument required by `Pi.authenticate()` SDK method, which checks for the user's incomplete payment each time the user is authenticated. If an incomplete payment is found, `onIncompletePaymentFound` callback will be invoked with the payment's [PaymentDTO](https://github.com/pi-apps/pi-platform-docs/blob/master/platform_API.md#paymentdto) object and the corresponding payment must be completed inside of your app. For more details about `onIncompletePaymentFound` please refer to [SDK Docs](https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md#onincompletepaymentfound)

```typescript
// frontend/src/Shop/index.ts

const onIncompletePaymentFound = (payment: PaymentDTO) => {
  console.log("onIncompletePaymentFound", payment);
  return axiosClient.post("/incomplete", { payment }, config);
};

const signIn = async () => {
  // ...
  const authResponse = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
  // ...
};
```

```typescript
// backend/src/index.ts

app.post("/incomplete", async (req, res) => {
  const payment = req.body.payment;
  const paymentId = payment.identifier;
  const txid = payment.transaction && payment.transaction.txid;
  const txURL = payment.transaction && payment.transaction._link;

  /* your custom logic checking against incomplete order in DB */
  const order = ...
  // ...

  /* check the transaction on the Pi blockchain */
  const horizonResponse = await axios.create({ timeout: 20000 }).get(txURL);
  const paymentIdOnBlock = horizonResponse.data.memo;

  /* check other data as well e.g. amount */
  if (paymentIdOnBlock !== order.pi_payment_id) {
    return res.status(400).json({ message: "Payment id doesn't match." });
  }

  /* mark the order as paid in your DB */
  // ...

  /* let Pi Servers know that the payment is completed */
  await axiosClient.post(`/v2/payments/${paymentId}/complete`, { txid }, config);
  return res.status(200).json({ message: `Handled the incomplete payment ${paymentId}` });
});
```
