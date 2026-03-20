# Pi Platform Demo App: Development Environment

This document explains how to set up a development environment and run the Pi Platform Demo App in the sandbox environment.

## Prerequisites

This guide assumes you have the following installed on your development machine:

- Node.js (recommended: v18 LTS or v20 LTS)
- Docker or MongoDB (MongoDB 7.0 compatible)

## 1. Clone the repository

```sh
git clone git@github.com:pi-apps/platform-demo-app.git
cd platform-demo-app
```

## 2. Register your app on the Developer Portal

Open `https://develop.pinet.com` in the Pi Browser on your mobile phone and complete the prerequisite steps (e.g., verifying your email address).

Create a new app by clicking the "New App" button.

### Registration process:

- **App Name:** The name of your app
- **Description:** A public user-facing description of your app
- **Network:** Select "Pi Testnet"

Once you submit the form, it will bring you to your app's main page. From here, go to the Checklist to continue setup.

### App Checklist (Steps 1-5):

1. **Register an App** - Completed in the previous step
2. **Configure App Hosting** - Select "Self hosted"
3. **Create a Pi Wallet** - See the [Pi Wallet Introduction](https://pi-apps.github.io/community-developer-guide/docs/importantTopics/paymentFlow/piWallet/) for more information
4. **Review Documentation** - Check our [Community Developer Guide](https://pi-apps.github.io/community-developer-guide/)
5. **Configure Development URL** - Set the URL where your app runs:
   - Running locally: `http://localhost:3314` (default port)
     - **Note:** You can change the port in `frontend/.env.development` using the `PORT` variable.
   - Running via Docker: `http://localhost` (adjust accordingly if there's any change to docker files)

### App Configuration:

- **Whitelisted usernames:** Leave blank for now
- **App URL:** Use your intended production URL (e.g., `https://mydemoapp.com`) or a placeholder (e.g., `https://example.com`). Must be HTTPS.

Before proceeding, click the "API Key" button on your app's main page and save the generated key—you'll need it for setup.

## 3. Set up your app

You can run the demo app in two ways:

### Option A: Run locally

- Set up the frontend following the [Frontend documentation](../frontend/README.md)
- Set up the backend following the [Backend documentation](../backend/README.md)

### Option B: Run via Docker Compose

- Follow the [Docker Setup documentation](./docker-setup.md)

## 4. Open the app in the Sandbox

To test all features, run the app in the Pi Sandbox.

The Sandbox enables running and debugging Pi Apps in a desktop browser, even though Pi Apps are designed for the Pi Browser.

For more information, see the [Community Developer Guide](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/piAppPlatform/piAppPlatformSDK/#the-sandbox-flag).

**On your desktop browser** (use Firefox for this demo app), open the Sandbox URL from Step 6 of your App Checklist. Use your own URL, not the one shown in screenshots.

![Sandbox URL](./img/sandbox_firefox.png)

> **Warning**
>
> The demo app uses Express session cookies, which some browsers block in the Sandbox environment.
> For best results, use **Mozilla Firefox**.

**Congratulations!** Your app should now work in the Sandbox, allowing you to sign in, place orders, and make testnet payments.

---

## More Information

For additional guidelines on registering apps and using the Sandbox, see the [Pi Developer Guide](https://pi-apps.github.io/community-developer-guide/).
