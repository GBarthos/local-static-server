'use strict';
const path = require('path');

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

const port = ((val) => parseInt(val, 10))(
    process.env.npm_package_config_port ||
    process.env.npm_config_port ||
    process.argv[3]
) || DEFAULT_PORT;

module.exports = {
    directory: path.join(process.cwd(), '', directory, '/'),
    port,
    help: process.argv.includes(HELP_FLAG) || process.argv.includes(HELP_SHORTHAND_FLAG),
    version: process.argv.includes(VERSION_FLAG) || process.argv.includes(VERSION_SHORTHAND_FLAG),
    silent: process.argv.includes(SILENT_FLAG) || process.argv.includes(SILENT_SHORTHAND_FLAG)
};
