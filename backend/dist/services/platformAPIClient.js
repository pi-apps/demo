"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const environments_1 = __importDefault(require("../environments"));
const platformAPIClient = axios_1.default.create({
    baseURL: environments_1.default.platform_api_url,
    timeout: 20000,
    headers: { 'Authorization': `Key ${environments_1.default.pi_api_key}` }
});
exports.default = platformAPIClient;
