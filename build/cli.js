"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .name('my-cli')
    .description('An example CLI for demonstration purposes')
    .version('1.0.0');
program
    .command('greet <name>')
    .description('Greet a person')
    .action((name) => {
    console.log(`Hello, ${name}!`);
});
program.parse(process.argv);
