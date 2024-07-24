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
exports.generateKeyPair = generateKeyPair;
exports.requestAirdrop = requestAirdrop;
exports.sendSol = sendSol;
exports.getBalance = getBalance;
exports.privateKeyStringToKeypair = privateKeyStringToKeypair;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const fs_1 = require("fs");
// import { connection } from "./cli";
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
            console.error("\x1b[31m%s\x1b[0m", "Error during airdrop request or confirmation:", e);
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
            console.error("\x1b[31m%s\x1b[0m", "Error during SOL transfer:", e);
        }
    });
}
function getBalance(publicKey) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const balance = yield connection.getBalance(publicKey);
            console.log(`\x1b[32mBalance of ${publicKey}: ${balance / web3_js_1.LAMPORTS_PER_SOL} SOL\x1b[0m`);
        }
        catch (e) {
            console.error("\x1b[31m%s\x1b[0m", "Error getting balance:", e);
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
