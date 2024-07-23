#!/usr/bin/env node
const commander = require("commander");
const figlet = require("figlet");

const program = new commander.Command();

// console.log(figlet.textSync("Solana CLI", {
//     font: "Standard",
//     horizontalLayout: "default",
//     verticalLayout: "default"
// }));

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-g, --generate", "generate new directory")
  .option("-a, --airdrop <receiver-address>", "Airdrop SOL to a public address")
  .option("-s, --send <amount> <sender-address> <receiver-address>", "Create a file")
  .parse(process.argv);

const options = program.opts();

program.parse(process.argv);