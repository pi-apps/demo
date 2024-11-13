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


react-scripts build Creating an optimized production build... Error: error:0308010C:digital envelope routines::unsupported at new Hash (node:internal/crypto/hash:67:19) at Object.createHash (node:crypto:130:10) at module.exports (/my-project/node_modules/webpack/lib/util/createHash.js:135:53) at NormalModule._initBuildHash (/my-project/node_modules/webpack/lib/NormalModule.js:417:16) at handleParseError (/my-project/node_modules/webpack/lib/NormalModule.js:471:10) at /my-project/node_modules/webpack/lib/NormalModule.js:503:5 at /my-project/node_modules/webpack/lib/NormalModule.js:358:12 at /my-project/node_modules/loader-runner/lib/LoaderRunner.js:373:3 at iterateNormalLoaders (/my-project/node_modules/loader-runner/lib/LoaderRunner.js:214:10) at iterateNormalLoaders (/my-project/node_modules/loader-runner/lib/LoaderRunner.js:221:10) at /my-project/node_modules/loader-runner/lib/LoaderRunner.js:236:3 at runSyncOrAsync (/my-project/node_modules/loader-runner/lib/LoaderRunner.js:130:11) at iterateNormalLoaders (/my-project/node_modules/loader-runner/lib/LoaderRunner.js:232:2) at Array.<anonymous> (/my-project/node_modules/loader-runner/lib/LoaderRunner.js:205:4) at Storage.finished (/my-project/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:55:16) at /my-project/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:91:9 /my-project/node_modules/react-scripts/scripts/build.js:19 throw err; ^ Error: error:0308010C:digital envelope routines::unsupported at new Hash (node:internal/crypto/hash:67:19) at Object.createHash (node:crypto:130:10) at module.exports (/my-project/node_modules/webpack/lib/util/createHash.js:135:53) at NormalModule._initBuildHash (/my-project/node_modules/webpack/lib/NormalModule.js:417:16) at /my-project/node_modules/webpack/lib/NormalModule.js:452:10 at /my-project/node_modules/webpack/lib/NormalModule.js:323:13 at /my-project/node_modules/loader-runner/lib/LoaderRunner.js:367:11 at /my-project/node_modules/loader-runner/lib/LoaderRunner.js:233:18 at context.callback (/my-project/node_modules/loader-runner/lib/LoaderRunner.js:111:13) at /my-project/node_modules/babel-loader/lib/index.js:59:103 { opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ], library: 'digital envelope routines', reason: 'unsupported', code: 'ERR_OSSL_EVP_UNSUPPORTED' } Node.js v17.0.0 ERROR: Job failed: exit status 1






current version of create-react-app: 4.0.3
  running from /home/.npm/_npx/34113/lib/node_modules/create-react-app

  System:
    OS: Linux 5.13 Ubuntu 21.10 21.10 (Impish Indri)
    CPU: (4) x64 Intel(R) Core(TM) i5-4460  CPU @ 3.20GHz
  Binaries:
    Node: 17.0.0 - /usr/bin/node
    Yarn: Not Found
    npm: 8.1.0 - /usr/bin/npm
  Browsers:
    Chrome: 95.0.4638.54
    Firefox: 93.0
  npmPackages:
    react: ^16.13.1 => 16.13.1 
    react-dom: ^16.13.1 => 16.13.1 
    react-scripts: ^4.0.3 => 4.0.3 
  npmGlobalPackages:
    create-react-app: Not Found


This XML file does not appear to have any style information associated with it. The document tree is shown below.
<!-- Copyright (C) 2017 The Android Open Source Project Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. -->
<resources>
<color name="colorPrimary">#FFFFFF</color>
<color name="colorPrimaryDark">#000000</color>
<color name="colorAccent">#FF4081</color>
</resources>


