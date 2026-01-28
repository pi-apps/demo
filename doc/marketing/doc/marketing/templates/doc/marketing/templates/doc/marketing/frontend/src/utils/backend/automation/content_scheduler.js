function schedulePost(platform, content, datetime) {
  return {
    platform,
    content,
    scheduled_for: datetime,
    status: "queued"
  };
}

module.exports = { schedulePost };
