'use strict';
const util = require('util');

function bare() {
    const text = util.format.apply(this, arguments);
    if (!text) { return; }
    process.nextTick(console.log, text);
}

function log() {
    const args = Array.prototype.slice.call(arguments);
    const params = [].concat(['[%s][%s] %s', new Date().toISOString(), 'Server'], args);
    bare.apply(this, params);
}

function err() {
    const args = Array.prototype.slice.call(arguments);
    const params = [].concat(['[ERROR] %s'], args);
    bare.apply(this, params);
}

log.bare = bare;
log.err = err;

module.exports = log;
