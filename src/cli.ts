#!/usr/bin/env node
import { Command } from "commander";
import { PublicKey } from "@solana/web3.js";
import {
    generateKeyPair, requestAirdrop,
    sendSol, privateKeyStringToKeypair
} from "./functions";

const program = new Command();
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
function handleOptions(options: any) {
    if (options.generate) {
        generateKeyPair();
    }

    if (options.airdrop) {
        try {
            const publicKey = new PublicKey(options.airdrop[1]);
            const amount = Number(options.airdrop[0]);
            if (isNaN(amount)) {
                console.error("Invalid amount for airdrop:", options.airdrop[0]);
                return;
            }
            requestAirdrop(amount, publicKey);
        } catch (e) {
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
        } catch (e) {
            console.error("Invalid amount to send:", options.send[0]);
            return;
        }

        let fromKeypair;
        try {
            fromKeypair = privateKeyStringToKeypair(options.send[1]);
        } catch (e) {
            console.error("Invalid private key:", options.send[1], e);
            return;
        }

        let toPubkey;
        try {
            toPubkey = new PublicKey(options.send[2]);
        } catch (e) {
            console.error("Invalid public key:", options.send[2], e);
            return;
        }

        sendSol(amount, fromKeypair, toPubkey);
    }
}

handleOptions(options);
