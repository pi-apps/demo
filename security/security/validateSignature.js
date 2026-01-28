const crypto = require("crypto");

module.exports = function validateSignature(req, res, next) {
  const signature = req.headers["x-pi-signature"];
  const payload = JSON.stringify(req.body);

  const expected = crypto
    .createHmac("sha256", process.env.PI_API_SECRET)
    .update(payload)
    .digest("hex");

  if (signature !== expected) {
    return res.status(403).json({ error: "Invalid signature" });
  }

  next();
};
