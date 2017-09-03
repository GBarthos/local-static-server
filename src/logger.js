'use strict';
const util = require('util');

function bare() {
    const text = util.format.apply(this, arguments);
    if (!text) { return; }
    process.nextTick(console.log, text);
}

function log() {
    const message = Array.prototype.slice.call(arguments)
        .filter((item) => typeof item === 'string')
        .join(' ')
        .trim();
    bare.call(this, '[%s][%s] %s', new Date().toISOString(), 'Server', message);
}

function err() {
    const message = Array.prototype.slice.call(arguments)
        .filter((item) => typeof item === 'string')
        .join(' ')
        .trim();
    const text = util.format.call(this, '[ERROR] %s', message);
    process.nextTick(console.error, text);
}

log.bare = bare;
log.err = err;

module.exports = log;
