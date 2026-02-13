export function deviceSecurity(req, res, next) {
  const device = req.headers["user-agent"];
  const ip = req.ip;

  if (!device) return res.status(403).json({ error: "Device not recognized." });

  // Simple logging for now
  console.log("Device:", device);
  console.log("IP:", ip);

  next();
}
