#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const web3_js_1 = require("@solana/web3.js");
const functions_1 = require("./functions");
const program = new commander_1.Command();
program
    .command('generate')
    .description('Generate a new keypair')
    .option('-o, --outfile <file>', 'Output file')
    .action((options) => {
    (0, functions_1.generateKeyPair)(options.output);
});
program
    .command('airdrop')
    .description('Request an airdrop')
    .requiredOption('-a, --amount <amount>', 'Amount of SOL to request')
    .requiredOption('-r, --receiver <receiverPublicKey>', 'Public key of the receiver')
    .action((amount, receiverPublicKeyString) => {
    (0, functions_1.requestAirdrop)(Number(amount), new web3_js_1.PublicKey(receiverPublicKeyString));
});
program
    .command('send')
    .description('Send SOL')
    .requiredOption('-a, --amount <amount>', 'Amount of SOL to send')
    .requiredOption('-s, --sender <senderPrivateKey>', 'Private key of the sender')
    .requiredOption('-r, --receiver <receiverPublicKey>', 'Public key of the receiver')
    .action((options) => {
    const { amount, senderPrivateKey, receiverPublicKey } = options;
    (0, functions_1.sendSol)(Number(amount), (0, functions_1.privateKeyStringToKeypair)(senderPrivateKey), new web3_js_1.PublicKey(receiverPublicKey));
});
program
    .command('balance <publicKey>')
    .description('Get balance of a wallet associated with a public key')
    .action((publicKey) => {
    (0, functions_1.getBalance)(new web3_js_1.PublicKey(publicKey));
});
program.parse(process.argv);
