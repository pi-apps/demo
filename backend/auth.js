const bcrypt = require("bcrypt");
const saltRounds = 12;

// Hash a password
function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

// Verify password
function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
