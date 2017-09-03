'use strict';

const app = require('./application');
const log = require('./logger');
const getPort = require('./port');

const {
    directory,
    port,
    help,
    version,
    silent
} = require('./parser');
const {
    getPortCallback,
    gracefulShutdown,
    handleHelpArgument,
    handleVersionArgument
} = require('./helpers');

handleHelpArgument({ help });
handleVersionArgument({ version });

/* high-level variables */
const MORGAN_FORMAT = 'tiny';
let server;
const options = {
    host: 'localhost',
    port,
    exclusive: true,
    callback: getPortCallback
};

/* getting available port */
getPort(options).then((port) => {
    options.port = port;
    options.callback = null;

    /* start server */
    server = app({
        directory,
        format: MORGAN_FORMAT,
        silent
    }).listen(options)
    .on('listening', function () {
        const { address, port, family } = server.address();
        log(`server started at http://${address}:${port}/ on ${family}`);
        log(`... running on pid [${process.pid}]`);
        log(`... serving folder "${directory}"`);
    });
});

/* handling termination signals */
process.on('SIGINT',   () => { log.bare(' (SIGINT)');   gracefulShutdown(server) });
process.on('SIGHUP',   () => { log.bare(' (SIGHUP)');   gracefulShutdown(server) });
process.on('SIGQUIT',  () => { log.bare(' (SIGQUIT)');  gracefulShutdown(server) });
process.on('SIGTERM',  () => { log.bare(' (SIGTERM)');  gracefulShutdown(server) });
process.on('SIGTSTP',  () => { log.bare(' (SIGTSTP)');  gracefulShutdown(server) });
process.on('SIGBREAK', () => { log.bare(' (SIGBREAK)'); gracefulShutdown(server) });

/* exporting express application */
module.exports = app;
