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
    .option('-o, --output <file>', 'Output file')
    .action((options) => {
    (0, functions_1.generateKeyPair)(options.output);
});
program
    .command('airdrop <amount> <receiverPublicKey>')
    .description('Request an airdrop')
    .action((amount, receiverPublicKey) => {
    const publicKey = new web3_js_1.PublicKey(receiverPublicKey);
    (0, functions_1.requestAirdrop)(Number(amount), publicKey);
});
program
    .command('send <amount> <senderPrivateKey> <receiverPublicKey>')
    .description('Send SOL')
    .action((amount, senderPrivateKey, receiverPublicKeyString) => {
    const senderKeypair = (0, functions_1.privateKeyStringToKeypair)(senderPrivateKey);
    const receiverPublicKey = new web3_js_1.PublicKey(receiverPublicKeyString);
    (0, functions_1.sendSol)(Number(amount), senderKeypair, receiverPublicKey);
});
program
    .command('balance <publicKey>')
    .description('Get balance of a wallet associated with a public key')
    .action((publicKey) => {
    (0, functions_1.getBalance)(new web3_js_1.PublicKey(publicKey));
});
program.parse(process.argv);
