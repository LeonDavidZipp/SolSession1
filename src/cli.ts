#!/usr/bin/env node
const commander = require("commander");

import {
    Keypair, Connection, clusterApiUrl,
    SystemProgram, Transaction, PublicKey,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import bs58 from "bs58";
import { writeFileSync } from "fs";

let connection = new Connection(clusterApiUrl("testnet"));

/**
 * Generates a new keypair and writes it to a file
 */
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

/**
 * Request an airdrop of SOL to a public address
 * @param to The public address to send the airdrop to
 */
async function requestAirdrop(to: string) {
    
}

/**
 * Send SOL from one address to another
 * @param amount The amount of SOL to send
 * @param from The public address to send the SOL from
 * @param to The public address to send the SOL to
 */
async function sendSol(amount: number, from: string, to: string) {
    let transaction = new Transaction();
    const fromKeypair = privateKeyStringToKeypair(from);
    const toPubkey = new PublicKey(to);
 
    transaction.add(
    SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
    }),
    );
}

function privateKeyStringToKeypair(privateKeyString: string): Keypair {
    const privateKeyUint8Array = bs58.decode(privateKeyString);
    return Keypair.fromSecretKey(privateKeyUint8Array);
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