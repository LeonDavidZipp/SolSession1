import {
    Connection, clusterApiUrl,
    Keypair, SystemProgram, Transaction, PublicKey,
    LAMPORTS_PER_SOL, sendAndConfirmTransaction,
    BlockheightBasedTransactionConfirmationStrategy
} from "@solana/web3.js";
import bs58 from "bs58";
import { writeFileSync } from "fs";
// import { connection } from "./cli";

let connection = new Connection(clusterApiUrl("testnet"));

/**
 * Generates a new keypair and writes it to a file
 */
export async function generateKeyPair() {
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
export async function requestAirdrop(amount: number, to: PublicKey) {
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
export async function sendSol(amount: number, from: Keypair, to: PublicKey) {
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
export function privateKeyStringToKeypair(privateKeyString: string): Keypair {
    const privateKeyUint8Array = bs58.decode(privateKeyString);
    return Keypair.fromSecretKey(privateKeyUint8Array);
}