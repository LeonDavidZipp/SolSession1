#! /usr/bin/env node
import { Command } from "commander";
import { PublicKey } from "@solana/web3.js";
import {
    generateKeyPair, requestAirdrop,
    sendSol, getBalance, privateKeyStringToKeypair
} from "./functions";

const program = new Command();

program
    .command('generate')
    .description('Generate a new keypair')
    .action(() => {
        generateKeyPair();
    });

program
    .command('airdrop <amount> <receiverPublicKey>')
    .description('Request an airdrop')
    .action((amount: string, receiverPublicKey: string) => {
        const publicKey = new PublicKey(receiverPublicKey);
        requestAirdrop(Number(amount), publicKey);
    });

program
    .command('send <amount> <senderPrivateKey> <receiverPublicKey>')
    .description('Send SOL')
    .action((amount: string, senderPrivateKey: string, receiverPublicKeyString: string) => {
        const senderKeypair = privateKeyStringToKeypair(senderPrivateKey);
        const receiverPublicKey = new PublicKey(receiverPublicKeyString);
        sendSol(Number(amount), senderKeypair, receiverPublicKey);
    });

program
    .command('balance <publicKey>')
    .description('Get balance of a public address')
    .action((publicKey: string) => {
        getBalance(new PublicKey(publicKey));
    });

program.parse(process.argv);