"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const validator_1 = __importDefault(require("validator"));
const eventsource_1 = __importDefault(require("eventsource"));
const superagent_1 = __importDefault(require("superagent"));
const url_1 = __importDefault(require("url"));
const querystring_1 = __importDefault(require("querystring"));
class Client {
    constructor({ source, target, logger = console }) {
        this.source = source;
        this.target = target;
        this.logger = logger;
        if (!validator_1.default.isURL(this.source)) {
            throw new Error('The provided URL is invalid.');
        }
    }
    static async createChannel() {
        return superagent_1.default.head('https://smee.io/new').redirects(0).catch((err) => {
            return err.response.headers.location;
        });
    }
    onmessage(msg) {
        const data = JSON.parse(msg.data);
        const target = url_1.default.parse(this.target, true);
        const mergedQuery = Object.assign(target.query, data.query);
        target.search = querystring_1.default.stringify(mergedQuery);
        delete data.query;
        const req = superagent_1.default.post(url_1.default.format(target)).send(data.body);
        delete data.body;
        Object.keys(data).forEach(key => {
            req.set(key, data[key]);
        });
        req.end((err, res) => {
            if (err) {
                this.logger.error(err);
            }
            else {
                this.logger.info(`${req.method} ${req.url} - ${res.status}`);
            }
        });
    }
    onopen() {
        this.logger.info('Connected', this.events.url);
    }
    onerror(err) {
        this.logger.error(err);
    }
    start() {
        const events = new eventsource_1.default(this.source);
        // Reconnect immediately
        events.reconnectInterval = 0; // This isn't a valid property of EventSource
        events.addEventListener('message', this.onmessage.bind(this));
        events.addEventListener('open', this.onopen.bind(this));
        events.addEventListener('error', this.onerror.bind(this));
        this.logger.info(`Forwarding ${this.source} to ${this.target}`);
        this.events = events;
        return events;
    }
}
module.exports = Client;
