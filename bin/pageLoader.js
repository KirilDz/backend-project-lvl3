#!/usr/bin/env node
import commander from 'commander';
import debug from 'debug';
import pageLoader from '../index2.js';

commander
    .version('0.0.1')
    .description('Page loader utility')
    .option('-o, --output [dir]', 'output dir', '(default: "/home/user/current-dir")')
    .arguments('<url>')
    .action((url, options) => {
        pageLoader(url, options.output).then(() => 'Started');
    });

commander.parse(process.argv);
