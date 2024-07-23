#!/usr/bin/env node
const commander = require("commander");

import { Keypair } from "@solana/web3.js";
import { writeFileSync } from "fs";

async function generateKeyPair() {
    const keypair = Keypair.generate();
    const keyDetails = {
        privateKey: Array.from(keypair.secretKey),
        publicKeyString: keypair.publicKey.toString(),
        publicKey: Array.from(keypair.publicKey.toBuffer())
    };

    writeFileSync("keypair.json", JSON.stringify(keyDetails, null, 2));

    console.log("Keypair generated and written to keypair.json!");
}

async function requestAirdrop() {
    ;
}

async function sendSol() {
    ;
}


const program = new commander.Command();

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-g, --generate", "generate new directory")
  .option("-a, --airdrop <receiver-address>", "Airdrop SOL to a public address")
  .option("-s, --send <amount> <sender-address> <receiver-address>", "Create a file")
  .parse(process.argv);

const options = program.opts();

if (options.generate) {
  generateKeyPair();
}