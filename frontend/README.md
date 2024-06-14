# Pi Demo App Frontend

Pi Demo App is an example React app created with [Create React App](https://create-react-app.dev/).

### 1. Install dependencies:

You will need a working NodeJS installation, and `yarn`. **The demo app frontend isn't meant to support npm**.
In most cases, `yarn` will come along with your NodeJS installation.

Install dependencies by running `yarn install`.

### 2. Start the app:

Run the following command to start the app's development server: `yarn startNode17`
- This will open a browser window on http://localhost:3314 which you can close.
    - Instead open the Pi Browser, head to the developer portal and get your sandbox development url, step 6 of the app checklist.
    - Copy and paste that into the desktop browser of your choice.
    - In the Pi App open the hamburger menu, select Pi Utilities from the dropdown and hit 'authorize sandbox'.
    - Enter the code seen in your desktop browser into the 'authorize sandbox' page and click enter.
    - The browser should now reload and your app front end will be displayed.

- This is not a secure method for production since `--openssl-legacy-provider` will be enabled during the start up process.  
    - More information on it here, https://towardsdev.com/fixing-err-ossl-evp-unsupported-error-on-nodejs-17-25c21066601c
    - You will need to research what is best for your app before deploying.


---
You've completed the frontend setup, return to [`doc/development.md`](../doc/development.md) to finish setting up the demo app
