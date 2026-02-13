module.exports = function (err, req, res, next) {
  console.error("ERROR:", err.message);
  res.status(500).json({ error: "Server error" });
};
