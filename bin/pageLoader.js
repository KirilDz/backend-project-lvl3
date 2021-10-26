#!/usr/bin/env node
import commander from "commander";

commander
    .version('0.0.1')
    .description('Page loader utility')
    .option('-o, -output <dir>', 'output dir', '(default: "/home/user/current-dir")')
    .arguments('<url>')

commander.parse(process.argv);
