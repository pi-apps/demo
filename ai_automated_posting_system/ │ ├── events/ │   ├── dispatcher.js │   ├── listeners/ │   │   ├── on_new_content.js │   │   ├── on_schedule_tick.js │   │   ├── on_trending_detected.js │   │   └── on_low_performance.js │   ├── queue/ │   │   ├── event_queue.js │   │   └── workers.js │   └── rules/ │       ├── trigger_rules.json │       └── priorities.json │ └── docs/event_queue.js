const queue = [];

function addEvent(event) {
    queue.push(event);
}
function getNextEvent() {
    return queue.shift();
}

module.exports = { addEvent, getNextEvent };
