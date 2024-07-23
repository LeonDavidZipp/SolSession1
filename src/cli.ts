import { Command } from 'commander';

const program = new Command();

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