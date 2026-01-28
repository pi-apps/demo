const express = require("express");
const app = express();
const optimizerRoutes = require("./optimizer_routes");
const analyticsRoutes = require("./analytics_routes");
const auth = require("./auth");

app.use(express.json());
app.use("/auth", auth);
app.use("/optimizer", optimizerRoutes);
app.use("/analytics", analyticsRoutes);

app.listen(3000, () => {
    console.log("API running on port 3000");
});
