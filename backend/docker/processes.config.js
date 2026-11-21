// PM2 config file to run the app in production mode.
// Make sure the name of this file ends with config.js

const apps = [{
  name: "demoapp-backend",
  script: "/usr/src/app/build/index.js",
  exec_mode: "cluster",
  instances: 4,
}];

// Scheduled job that collects due subscription renewals (see doc/subscription-processing.md).
// It is only scheduled once PI_SUBSCRIPTION_SERVICE_ID is set, so the app runs as before without it.
// PM2 runs it once when the container starts, then on the cron schedule. `autorestart: false` keeps PM2
// from restarting it each time it exits.
if (process.env.PI_SUBSCRIPTION_SERVICE_ID) {
  apps.push({
    name: "process-subscriptions",
    script: "/usr/src/app/build/jobs/processSubscriptions.js",
    exec_mode: "fork",
    instances: 1,
    cron_restart: process.env.SUBSCRIPTION_PROCESS_CRON || "0 */12 * * *",
    autorestart: false,
  });
}

module.exports = {
  apps,
}
