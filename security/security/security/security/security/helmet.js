const helmet = require("helmet");
module.exports = helmet({
  contentSecurityPolicy: false,
});
