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
`Usage: \tlocal-server [directory] [port] [OPTIONS]

Inputs:
    directory \t The directory to serve from. (Optional)
    port      \t The port to start the server on. (Optional)

Options:
    -s, --silent  \t Keep logs at minimal
    -v, --version \t Display version number
    -h, --help    \t Show this message

Examples:
    local-server public/src 9000
    local-server ../client
    local-server / 4000
    local-server

${pck.author ? `Author: \t${author}` : ''}
${pck.license ? `License: \t${pck.license}` : ''}
Version: \t${pck.name}@${pck.version}`
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
