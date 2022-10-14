// PM2 config file to run the app in production mode.
// Make sure the name of this file ends with config.js

module.exports = {
  apps: [{
    name: "demoapp-backend",
    script: "/usr/src/app/build/index.js",
    exec_mode: "cluster",
    instances: 4,
  }]
}