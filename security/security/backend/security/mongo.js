const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  autoIndex: false,
  family: 4,
  serverSelectionTimeoutMS: 5000,
});
