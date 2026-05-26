import fs from "fs";
import path from "path";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import logger from "morgan";
import MongoStore from "connect-mongo";
import { MongoClient } from "mongodb";
import env from "./environments";
import mountPaymentsEndpoints from "./handlers/payments";
import mountUserEndpoints from "./handlers/users";

// We must import typedefs for ts-node-dev to pick them up when they change
import "./types/session";
import mountNotificationEndpoints from "./handlers/notifications";

// ================== MONGODB CONNECTION (HARDCODE - ĐÃ SỬA) ==================
const dbName = "ghnpi_db";
const mongoUri = "mongodb://admin:admin123@localhost:27027/ghnpi_db?authSource=admin";

console.log("🔗 Connecting to MongoDB with hardcoded URI");
console.log("Database:", dbName);

const mongoClientOptions = {
  authSource: "admin",
};

// I. Initialize and set up the express app and various middlewares and packages:
const app: express.Application = express();

// Log requests to the console in a compact format:
app.use(logger("dev"));

// Full log of all requests to /log/access.log:
app.use(
  logger("common", {
    stream: fs.createWriteStream(path.join(__dirname, "..", "log", "access.log"), { flags: "a" }),
  }),
);

// Enable response bodies to be sent as JSON:
app.use(express.json());

// Handle CORS:
app.use(
  cors({
    origin: env.frontend_url,
    credentials: true,
  }),
);

// Handle cookies
app.use(cookieParser());

// Use sessions:
app.use(
  session({
    secret: env.session_secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      mongoOptions: mongoClientOptions,
      dbName: dbName,
      collectionName: "user_sessions",
    }),
  }) as unknown as express.RequestHandler,
);

// II. Mount app endpoints:

// Payments endpoint under /payments:
const paymentsRouter = express.Router();
mountPaymentsEndpoints(paymentsRouter);
app.use("/payments", paymentsRouter);

// User endpoints under /user:
const userRouter = express.Router();
mountUserEndpoints(userRouter);
app.use("/user", userRouter);

// Notification endpoints under /notifications:
const notificationRouter = express.Router();
mountNotificationEndpoints(notificationRouter);
app.use("/notifications", notificationRouter);

// Hello World page:
app.get("/", async (_, res) => {
  res.status(200).send({ message: "Hello, World! GHN.PI Backend is running!" });
});

// III. Boot up the app:
const start = async () => {
  try {
    const client = await MongoClient.connect(mongoUri, mongoClientOptions);
    const db = client.db(dbName);
    
    app.locals.orderCollection = db.collection("orders");
    app.locals.userCollection = db.collection("users");

    console.log("✅ Connected to MongoDB successfully!");
    console.log(`App platform demo app - Backend listening on port ${env.port}!`);

    app.listen(env.port, () => {
      console.log(`🚀 Backend running at http://localhost:${env.port}`);
      console.log(`🌐 Frontend configured at: ${env.frontend_url}`);
    });
  } catch (err) {
    console.error("❌ Connection to MongoDB failed: ", err);
    process.exit(1);
  }
};

start();