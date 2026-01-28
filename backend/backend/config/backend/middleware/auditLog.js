const fs = require('fs');

function logAction(userId, action, details) {
    const log = `${new Date().toISOString()} | ${userId} | ${action} | ${details}\n`;
    fs.appendFileSync('logs/audit.log', log);
}

module.exports = logAction;
