#!/usr/bin/env node
const commander = require("commander");
import { Command } from "commander";

import {
    Keypair, Connection, clusterApiUrl,
    SystemProgram, Transaction, PublicKey,
    LAMPORTS_PER_SOL, sendAndConfirmTransaction,
    BlockheightBasedTransactionConfirmationStrategy
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

    console.log("\x1b[32mKeypair generated and written to keypair.json!\x1b[0m");
}

/**
 * Request an airdrop of SOL to a public address
 * @param to The public address to send the airdrop to
 */
async function requestAirdrop(amount: number, to: PublicKey) {
    try {
        const airdropSignature = await connection.requestAirdrop(to, amount * LAMPORTS_PER_SOL);
        const blockhash = await connection.getLatestBlockhash();
        const blockheight = await connection.getBlockHeight();

        const confArgs: BlockheightBasedTransactionConfirmationStrategy = {
            signature: airdropSignature,
            blockhash: blockhash.blockhash,
            lastValidBlockHeight: blockheight,
        };

        const transaction = await connection.confirmTransaction(confArgs);
        console.log(`Airdrop successful: ${transaction.value}`);
    } catch (e) {
        console.error("Error during airdrop request or confirmation:", e);
    }
}

/**
 * Send SOL from one address to another
 * @param amount The amount of SOL to send
 * @param from The public address to send the SOL from
 * @param to The public address to send the SOL to
 */
async function sendSol(amount: number, from: Keypair, to: PublicKey) {
    // let fromKeypair;
    // try {
    //     fromKeypair = privateKeyStringToKeypair(from);
    // } catch (e) {
    //     console.error("Invalid private key:", from, e);
    //     return;
    // }

    // let toPubkey;
    // try {
    //     toPubkey = new PublicKey(to);
    // } catch (e) {
    //     console.error("Invalid public key:", to, e);
    //     return;
    // }

    try {
        let transaction = new Transaction();
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: amount * LAMPORTS_PER_SOL,
            }),
        );
        const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
        console.log(`\x1b[32mSent ${amount} SOL from ${from} to ${to}`);
        console.log(`Transction hash: ${signature}\x1b[0m`);
    } catch (e) {
        console.error("Error during SOL transfer:", e);
    }
}

/**
 * converts a private key string to a Keypair object
 * @param privateKeyString
 * @returns 
 */
function privateKeyStringToKeypair(privateKeyString: string): Keypair {
    const privateKeyUint8Array = bs58.decode(privateKeyString);
    return Keypair.fromSecretKey(privateKeyUint8Array);
}

const program = new Command();

program
    .version("1.0.0")
    .description("Solana CLI for generating keypairs, requesting airdrops, and sending SOL")
    .option("-g, --generate", "generate new keypair")
    .option("-a, --airdrop <receiver-address>", "request an airdrop")
    .option("-s, --send <amount> <sender-address> <receiver-address>", "send SOL")
    .parse(process.argv);

const options = program.opts();

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
