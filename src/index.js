'use strict';
const http = require('http');
const destroyable = require('server-destroy');

const app = require('./application');
const helpers = require('./helpers');
const log = require('./logger');
const parser = require('./parser');
const getPort = require('./port');

/* high-level variables */
const directory = parser.directory;
const port = parser.port;
const help = parser.help;
const version = parser.version;
const silent = parser.silent;

const gracefulShutdown = helpers.gracefulShutdown;

/* high-level variables */
const MORGAN_FORMAT = 'tiny';
let server;
const options = {
    host: 'localhost',
    port,
    exclusive: true,
    callback: getPortCallback
};

/* handle CLI arguments */
helpers.handleHelpArgument({ help });
helpers.handleVersionArgument({ version });

/* getting available port */
let server;
getPort(options)
    .then((port) => {
    /* create server */
        server = http.createServer(
            app({
        directory,
        format: MORGAN_FORMAT,
        silent
            })
        );

    /* enhance server with destroy method */
    destroyable(server);

    /* start server */
    server.listen(options)
            .on('listening', () => {
                const address = server.address();

                log(`server started at http://${address.address}:${address.port}/ on ${address.family}`);
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
