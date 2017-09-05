'use strict';
const log = require('./logger');
const pck = require('../package.json');

const DELAYED_TERMINATION_TIMEOUT = 8000;
const DELAYED_EXIT_TIMEOUT = 1000;
let IMMEDIATE_TERMINATION = false;

/* helpers */
function _processExiting(code=0) {
    process.nextTick(process.exit, code);
}

function _immediateExit(code) {
    log('server closed');
    _processExiting(code);
}

function _delayedExit() {
    log('... server closing timed out, forcefully shutting down');
    setTimeout(_immediateExit, DELAYED_EXIT_TIMEOUT);
}

function gracefulShutdown(server) {
    if (IMMEDIATE_TERMINATION) {
        log('... immediate termination signaled');
        _immediateExit(130);
        return;
    }

    log('... graceful shutdown signaled');
    server.unref();
    server.close(_immediateExit);

    setTimeout(_delayedExit, DELAYED_TERMINATION_TIMEOUT);
    setTimeout(() => {
        IMMEDIATE_TERMINATION = true;
    }, DELAYED_EXIT_TIMEOUT);
}

function _printAuthor() {
    if (!pck.author){ return ''; }
    if (typeof pck.author === 'string') { return pck.author; }
    return [
        `${pck.author.name || ''}`,
        `${pck.author.email ? `<${pck.author.email}>` : ''}`,
        `${pck.author.url ? `(${pck.author.url})` : ''}`
    ].join(' ').trim();
}

function _printVersion() {
    return `${pck.version}`;
}

function _printUsage() {
    const author = _printAuthor();

    return (
        `Usage: \tlocal-server [directory] [port] [OPTIONS]` +
        `\n` +
        `\nInputs:` +
        `\n\tdirectory \t The directory to serve from. (Optional)` +
        `\n\tport      \t The port to start the server on. (Optional)` +
        `\n` +
        `\nOptions:` +
        `\n\t-s, --silent  \t Keep logs at minimal` +
        `\n\t-v, --version \t Display version number` +
        `\n\t-h, --help    \t Show this message` +
        `\n` +
        `\nExamples:` +
        `\n\tlocal-server public/src 9000` +
        `\n\tlocal-server ../client` +
        `\n\tlocal-server / 4000` +
        `\n\tlocal-server` +
        `\n` +
        `${pck.author ? `\nAuthor: \t${author}` : ''}` +
        `${pck.license ? `\nLicense: \t${pck.license}` : ''}` +
        `\nVersion: \t${pck.name}@${pck.version}`
    );
}

function handleHelpArgument(args) {
    if (args.help) {
        log.bare(_printUsage());
        process.nextTick(process.exit);
    }
}

function handleVersionArgument(args) {
    if (args.version) {
        log.bare(_printVersion());
        process.nextTick(process.exit);
    }
}

function getPortCallback(err, value) {
    if (err.code !== 'EADDRINUSE') {
        log.err(err);
        _processExiting();
    }

    log(`port ${value} is busy ...`);
}

module.exports = {
    getPortCallback,
    gracefulShutdown,
    handleHelpArgument,
    handleVersionArgument
};
