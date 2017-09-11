'use strict';
const log = require('./logger');
const pck = require('../package.json');

/* helpers */
function gracefulShutdown(server) {
    log('... graceful shutdown signaled');
    server.unref();

    server.destroy(() => {
        log('server closed');
        process.exitCode = 130;
    });
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
        `\n\n` +
        `Inputs:` +
        `\n\tdirectory \t The directory to serve from. (Optional)` +
        `\n\tport      \t The port to start the server on. (Optional)` +
        `\n\n` +
        `Options:` +
        `\n\t-s, --silent  \t Keep logs at minimal` +
        `\n\t-v, --version \t Display version number` +
        `\n\t-h, --help    \t Show this message` +
        `\n\n` +
        `Examples:` +
        `\n\tlocal-server public/src 9000` +
        `\n\tlocal-server ../client` +
        `\n\tlocal-server / 4000` +
        `\n\tlocal-server` +
        `\n` +
        `${pck.author ? `\nAuthor: \t${author}` : ''}` +
        `${pck.license ? `\nLicense: \t${pck.license}` : ''}` +
        `\nVersion: \t${pck.name}@${pck.version}` +
        `\n`
    );
}

function handleHelpArgument(args) {
    if (args.help) {
        log.bare(_printUsage());
        process.nextTick(process.exit, 0);
    }
}

function handleVersionArgument(args) {
    if (args.version) {
        log.bare(_printVersion());
        process.nextTick(process.exit, 0);
    }
}

module.exports = {
    gracefulShutdown,
    handleHelpArgument,
    handleVersionArgument
};
