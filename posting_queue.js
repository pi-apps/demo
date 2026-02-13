let queue = [];

module.exports.addToQueue = function (post) {
  queue.push(post);
};

module.exports.processQueue = async function () {
  for (const job of queue) {
    try {
      await job.platformAPI.publish(job.content);
    } catch (err) {
      console.error("Error posting:", err);
    }
  }
  queue = [];
};
