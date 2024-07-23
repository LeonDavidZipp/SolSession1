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
        console.log("Keypair generated and written to keypair.json!");
    });
}
/**
 * Request an airdrop of SOL to a public address
 * @param to The public address to send the airdrop to
 */
function requestAirdrop(to) {
    return __awaiter(this, void 0, void 0, function* () {
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
        let transaction = new web3_js_1.Transaction();
        const fromKeypair = privateKeyStringToKeypair(from);
        const toPubkey = new web3_js_1.PublicKey(to);
        transaction.add(web3_js_1.SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toPubkey,
            lamports: amount * web3_js_1.LAMPORTS_PER_SOL,
        }));
        (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [fromKeypair]);
        console.log(`Sent ${amount} SOL from ${from} to ${to}`);
        console.log(`Transction hash: ${transaction.signature}`);
    });
}
function privateKeyStringToKeypair(privateKeyString) {
    const privateKeyUint8Array = bs58_1.default.decode(privateKeyString);
    return web3_js_1.Keypair.fromSecretKey(privateKeyUint8Array);
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
if (options.airdrop) {
    requestAirdrop(options.airdrop);
}
if (options.send) {
    sendSol(options.send[0], options.send[1], options.send[2]);
}
