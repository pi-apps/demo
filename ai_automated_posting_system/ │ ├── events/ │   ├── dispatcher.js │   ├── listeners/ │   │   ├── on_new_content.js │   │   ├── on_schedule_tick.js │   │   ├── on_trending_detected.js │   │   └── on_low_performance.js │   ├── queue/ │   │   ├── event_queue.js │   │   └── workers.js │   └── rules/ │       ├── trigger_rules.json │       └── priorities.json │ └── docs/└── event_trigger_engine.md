const listeners = {
    newContent: require("./listeners/on_new_content"),
    schedule: require("./listeners/on_schedule_tick"),
    trending: require("./listeners/on_trending_detected"),
    lowPerformance: require("./listeners/on_low_performance"),
};

function dispatch(eventType, payload) {
    if (!listeners[eventType]) {
        console.log("Unknown event type:", eventType);
        return;
    }
    listeners[eventType](payload);
}

module.exports = dispatch;
