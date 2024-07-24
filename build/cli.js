#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const web3_js_1 = require("@solana/web3.js");
const functions_1 = require("./functions");
const program = new commander_1.Command();
program
    .version("1.0.0")
    .description("Solana CLI for generating keypairs, requesting airdrops, and sending SOL")
    .option("-g, --generate", "generate new keypair")
    .option("-a, --airdrop <receiver-address>", "request an airdrop")
    .option("-s, --send <amount> <sender-address> <receiver-address>", "send SOL")
    .parse(process.argv);
const options = program.opts();
/**
 * Handles the options passed to the CLI. Handles input parsing and calls the appropriate functions
 * @param options
 */
function handleOptions(options) {
    if (options.generate) {
        (0, functions_1.generateKeyPair)();
    }
    if (options.airdrop) {
        try {
            const publicKey = new web3_js_1.PublicKey(options.airdrop[1]);
            const amount = Number(options.airdrop[0]);
            if (isNaN(amount)) {
                console.error("Invalid amount for airdrop:", options.airdrop[0]);
                return;
            }
            (0, functions_1.requestAirdrop)(amount, publicKey);
        }
        catch (e) {
            console.error("Error processing airdrop:", e);
            return;
        }
    }
    if (options.send) {
        let amount;
        try {
            amount = Number(options.send[0]);
            if (isNaN(amount)) {
                console.error("Invalid amount to send:", options.send[0]);
                return;
            }
        }
        catch (e) {
            console.error("Invalid amount to send:", options.send[0]);
            return;
        }
        let fromKeypair;
        try {
            fromKeypair = (0, functions_1.privateKeyStringToKeypair)(options.send[1]);
        }
        catch (e) {
            console.error("Invalid private key:", options.send[1], e);
            return;
        }
        let toPubkey;
        try {
            toPubkey = new web3_js_1.PublicKey(options.send[2]);
        }
        catch (e) {
            console.error("Invalid public key:", options.send[2], e);
            return;
        }
        (0, functions_1.sendSol)(amount, fromKeypair, toPubkey);
    }
}
handleOptions(options);
