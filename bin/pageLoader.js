#!/usr/bin/env node
import commander from "commander";
import pageLoader from '../index.js';
import debug from "debug";

commander
    .version('0.0.1')
    .description('Page loader utility')
    .option('-o, --output [dir]', 'output dir', '(default: "/home/user/current-dir")')
    .arguments('<url>')
    .action((url, options) => {
        debug('Start', url, options);
        pageLoader(url, options.output).then(res => console.log(res));
    })

commander.parse(process.argv);
