#!/usr/bin/env node
import commander from 'commander';
import debug from 'debug';
import pageLoader from '../index2.js';

const DEFAULT_DIR = '(default: "/home/user/current-dir")';

commander
    .version('0.0.1')
    .description('Page loader utility')
    .option('-o, --output [dir]', 'output dir', DEFAULT_DIR)
    .arguments('<url>')
    .action((url, options) => {
        pageLoader(url, options.output === DEFAULT_DIR ? process.cwd() : options.output).then(() => 'Started');
    });

commander.parse(process.argv);
