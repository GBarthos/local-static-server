'use strict';
const path = require('path');
const includes = require('lodash.includes');

const DEFAULT_PORT = 3000;
const DEFAULT_DIRECTORY = '';
const HELP_FLAG = '--help';
const HELP_SHORTHAND_FLAG = '-h';
const SILENT_FLAG = '--silent';
const SILENT_SHORTHAND_FLAG = '-s';
const VERSION_FLAG = '--version';
const VERSION_SHORTHAND_FLAG = '-v';

const directory = process.env.npm_package_config_directory ||
    process.env.npm_config_directory ||
    process.argv[2] ||
    DEFAULT_DIRECTORY;

let port = process.env.npm_package_config_port ||
    process.env.npm_config_port ||
    process.argv[3];

port = parseInt(port, 10) || DEFAULT_PORT;

module.exports = {
    directory: path.join(process.cwd(), '', directory, '/'),
    port,
    help: includes(process.argv, HELP_FLAG) || includes(process.argv, HELP_SHORTHAND_FLAG),
    version: includes(process.argv, VERSION_FLAG) || includes(process.argv, VERSION_SHORTHAND_FLAG),
    silent: includes(process.argv, SILENT_FLAG) || includes(process.argv, SILENT_SHORTHAND_FLAG)
};
