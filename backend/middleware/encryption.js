const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, "salt", 32);
const iv = Buffer.alloc(16, 0);

exports.encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return cipher.update(text, "utf8", "hex") + cipher.final("hex");
};

exports.decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return decipher.update(hash, "hex", "utf8") + decipher.final("utf8");
};
