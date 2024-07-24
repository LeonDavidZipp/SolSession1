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
    .option('-o, --outfile <file>', 'Output file')
    .action((options: { output?: string }) => {
        generateKeyPair(options.output);
    });

program
    .command('airdrop')
    .description('Request an airdrop')
    .requiredOption('-a, --amount <amount>', 'Amount of SOL to request')
    .requiredOption('-r, --receiverPublicKey <receiverPublicKey>', 'Public key of the receiver')
    .action((amount: string, receiverPublicKeyString: string) => {
        requestAirdrop(Number(amount), new PublicKey(receiverPublicKeyString));
    });

program
    .command('send')
    .description('Send SOL')
    .requiredOption('-a, --amount <amount>', 'Amount of SOL to send')
    .requiredOption('-s, --senderPrivateKey <senderPrivateKey>', 'Private key of the sender')
    .requiredOption('-r, --receiverPublicKey <receiverPublicKey>', 'Public key of the receiver')
    .action((options: { amount: string, senderPrivateKey: string, receiverPublicKey: string }) => {
        const { amount, senderPrivateKey, receiverPublicKey } = options;
        sendSol(Number(amount), privateKeyStringToKeypair(senderPrivateKey), new PublicKey(receiverPublicKey));
    });

program
    .command('balance <publicKey>')
    .description('Get balance of a wallet associated with a public key')
    .action((publicKey: string) => {
        getBalance(new PublicKey(publicKey));
    });

program.parse(process.argv);
