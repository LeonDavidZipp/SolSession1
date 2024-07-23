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
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const web3_js_1 = require("@solana/web3.js");
const fs_1 = require("fs");
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
function requestAirdrop() {
    return __awaiter(this, void 0, void 0, function* () {
        ;
    });
}
function sendSol() {
    return __awaiter(this, void 0, void 0, function* () {
        ;
    });
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
