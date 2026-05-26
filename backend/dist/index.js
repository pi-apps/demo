"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const mongodb_1 = require("mongodb");
const environments_1 = __importDefault(require("./environments"));
const payments_1 = __importDefault(require("./handlers/payments"));
const users_1 = __importDefault(require("./handlers/users"));
// We must import typedefs for ts-node-dev to pick them up when they change
require("./types/session");
const notifications_1 = __importDefault(require("./handlers/notifications"));
// ================== MONGODB CONNECTION (HARDCODE - ĐÃ SỬA) ==================
const dbName = "ghnpi_db";
const mongoUri = "mongodb://admin:admin123@localhost:27027/ghnpi_db?authSource=admin";
console.log("🔗 Connecting to MongoDB with hardcoded URI");
console.log("Database:", dbName);
const mongoClientOptions = {
    authSource: "admin",
};
// I. Initialize and set up the express app and various middlewares and packages:
const app = (0, express_1.default)();
// Log requests to the console in a compact format:
app.use((0, morgan_1.default)("dev"));
// Full log of all requests to /log/access.log:
app.use((0, morgan_1.default)("common", {
    stream: fs_1.default.createWriteStream(path_1.default.join(__dirname, "..", "log", "access.log"), { flags: "a" }),
}));
// Enable response bodies to be sent as JSON:
app.use(express_1.default.json());
// Handle CORS:
app.use((0, cors_1.default)({
    origin: environments_1.default.frontend_url,
    credentials: true,
}));
// Handle cookies
app.use((0, cookie_parser_1.default)());
// Use sessions:
app.use((0, express_session_1.default)({
    secret: environments_1.default.session_secret,
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: mongoUri,
        mongoOptions: mongoClientOptions,
        dbName: dbName,
        collectionName: "user_sessions",
    }),
}));
// II. Mount app endpoints:
// Payments endpoint under /payments:
const paymentsRouter = express_1.default.Router();
(0, payments_1.default)(paymentsRouter);
app.use("/payments", paymentsRouter);
// User endpoints under /user:
const userRouter = express_1.default.Router();
(0, users_1.default)(userRouter);
app.use("/user", userRouter);
// Notification endpoints under /notifications:
const notificationRouter = express_1.default.Router();
(0, notifications_1.default)(notificationRouter);
app.use("/notifications", notificationRouter);
// Hello World page:
app.get("/", async (_, res) => {
    res.status(200).send({ message: "Hello, World! GHN.PI Backend is running!" });
});
// III. Boot up the app:
const start = async () => {
    try {
        const client = await mongodb_1.MongoClient.connect(mongoUri, mongoClientOptions);
        const db = client.db(dbName);
        app.locals.orderCollection = db.collection("orders");
        app.locals.userCollection = db.collection("users");
        console.log("✅ Connected to MongoDB successfully!");
        console.log(`App platform demo app - Backend listening on port ${environments_1.default.port}!`);
        app.listen(environments_1.default.port, () => {
            console.log(`🚀 Backend running at http://localhost:${environments_1.default.port}`);
            console.log(`🌐 Frontend configured at: ${environments_1.default.frontend_url}`);
        });
    }
    catch (err) {
        console.error("❌ Connection to MongoDB failed: ", err);
        process.exit(1);
    }
};
start();
