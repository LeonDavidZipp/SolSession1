#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const commander_1 = require("commander");
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const fs_1 = require("fs");
let connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("testnet"));
/**
 * Generates a new keypair and writes it to a file
 */
function generateKeyPair() {
    return __awaiter(this, void 0, void 0, function* () {
        const keypair = web3_js_1.Keypair.generate();
        const keyDetails = {
            privateKey: Array.from(keypair.secretKey),
            publicKeyString: keypair.publicKey.toString(),
            publicKey: Array.from(keypair.publicKey.toBuffer())
        };
        (0, fs_1.writeFileSync)("keypair.json", JSON.stringify(keyDetails, null, 2));
        console.log("\x1b[32mKeypair generated and written to keypair.json!\x1b[0m");
    });
}
/**
 * Request an airdrop of SOL to a public address
 * @param to The public address to send the airdrop to
 */
function requestAirdrop(amount, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const airdropSignature = yield connection.requestAirdrop(to, amount * web3_js_1.LAMPORTS_PER_SOL);
            const blockhash = yield connection.getLatestBlockhash();
            const blockheight = yield connection.getBlockHeight();
            const confArgs = {
                signature: airdropSignature,
                blockhash: blockhash.blockhash,
                lastValidBlockHeight: blockheight,
            };
            const transaction = yield connection.confirmTransaction(confArgs);
            console.log(`Airdrop successful: ${transaction.value}`);
        }
        catch (e) {
            console.error("Error during airdrop request or confirmation:", e);
        }
    });
}
/**
 * Send SOL from one address to another
 * @param amount The amount of SOL to send
 * @param from The public address to send the SOL from
 * @param to The public address to send the SOL to
 */
function sendSol(amount, from, to) {
    return __awaiter(this, void 0, void 0, function* () {
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
            let transaction = new web3_js_1.Transaction();
            transaction.add(web3_js_1.SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: amount * web3_js_1.LAMPORTS_PER_SOL,
            }));
            const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [from]);
            console.log(`\x1b[32mSent ${amount} SOL from ${from} to ${to}`);
            console.log(`Transction hash: ${signature}\x1b[0m`);
        }
        catch (e) {
            console.error("Error during SOL transfer:", e);
        }
    });
}
/**
 * converts a private key string to a Keypair object
 * @param privateKeyString
 * @returns
 */
function privateKeyStringToKeypair(privateKeyString) {
    const privateKeyUint8Array = bs58_1.default.decode(privateKeyString);
    return web3_js_1.Keypair.fromSecretKey(privateKeyUint8Array);
}
const program = new commander_1.Command();
program
    .version("1.0.0")
    .description("Solana CLI for generating keypairs, requesting airdrops, and sending SOL")
    .option("-g, --generate", "generate new keypair")
    .option("-a, --airdrop <receiver-address>", "request an airdrop")
    .option("-s, --send <amount> <sender-address> <receiver-address>", "send SOL")
    .parse(process.argv);
const options = program.opts();
function handleOptions(options) {
    if (options.generate) {
        generateKeyPair();
    }
    if (options.airdrop) {
        try {
            const publicKey = new web3_js_1.PublicKey(options.airdrop[1]);
            const amount = Number(options.airdrop[0]);
            if (isNaN(amount)) {
                console.error("Invalid amount for airdrop:", options.airdrop[0]);
                return;
            }
            requestAirdrop(amount, publicKey);
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
            fromKeypair = privateKeyStringToKeypair(options.send[1]);
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
        sendSol(amount, fromKeypair, toPubkey);
    }
}
handleOptions(options);
