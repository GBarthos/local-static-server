'use strict';

const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

module.exports = function ({ directory, format, silent }) {
    const app = express();

    /* express middleware */
    if (!silent) {
        app.use(morgan(format));
    }
    app.use(express.static(directory));
    app.use(cors());

    // allow CORS pre-flight
    app.options('*', cors());
    
    return app;
};
