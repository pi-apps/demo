"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
console.log("NODE_ENV: " + process.env.NODE_ENV);
const result = dotenv_1.default.config();
if (result.error) {
    if (process.env.NODE_ENV === "development") {
        console.error(".env file not found. This is an error condition in development. Additional error is logged below");
        throw result.error;
    }
    // In production, environment variables are injected into the container environment. We should not even have
    // a .env file inside the running container.
}
const env = {
    port: parseInt(process.env.PORT || "8000"),
    session_secret: process.env.SESSION_SECRET || "This is my session secret",
    pi_api_key: process.env.PI_API_KEY || "",
    platform_api_url: process.env.PLATFORM_API_URL || "",
    mongo_host: process.env.MONGO_HOST || "localhost:27017",
    mongo_db_name: process.env.MONGODB_DATABASE_NAME || "demo-app",
    mongo_user: process.env.MONGODB_USERNAME || "",
    mongo_password: process.env.MONGODB_PASSWORD || "",
    frontend_url: process.env.FRONTEND_URL || "http://localhost:3314",
};
exports.default = env;
