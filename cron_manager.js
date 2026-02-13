const cron = require("node-cron");
const { processQueue } = require("./posting_queue");

cron.schedule("*/30 * * * *", () => {
  console.log("[CRON] Processing posting queue...");
  processQueue();
});
