'use strict';
const net = require('net');

function getPort(options) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();

        server.unref();
        server.on('error', (err) => {
            if (typeof options.callback === 'function') {
                options.callback(err, options.port);
            }
            server.close(() => {
                reject({ err, options });
            });
        });

        server.listen(options, () => {
            const port = server.address().port;
            server.close(() => {
                resolve(port);
            });
        });
    }).catch(({ err, options }) => {
        options.port++;

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getPort(options))
            }, 250, options);
        });
        
        // return getPort(options)
    });
};

module.exports = function(options) {
    // For backwards compatibility with number-only input
    // TODO: Remove this in the next major version
    if (typeof options === 'number') {
        options = {
            port: options
        };
    }

    return (options && typeof options.port === 'number') ?
        getPort(options) :
        getPort({ port: 0 });
};
