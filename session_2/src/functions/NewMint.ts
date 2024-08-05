import {
    Connection,
    clusterApiUrl,
    PublicKey,
    Transaction,
    TransactionSignature,
    Keypair,
    SystemProgram,
} from "@solana/web3.js";
import {
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccount,
    createInitializeAccountInstruction,
    createInitializeMintInstruction,
    createMint,
    getAccountLenForMint,
    getMinimumBalanceForRentExemptAccount,
    getMinimumBalanceForRentExemptMint,
    getMint,
    transfer,
    getOrCreateAssociatedTokenAccount,
    mintTo,
} from "@solana/spl-token";

/**
 * Creates a new token mint
 * @param connection the connection to the solana blockchain
 * @param payer the keypair of the payer
 * @param decimals the number of decimals for the token
 * @returns public key of the mint
 */
export const TokenMint = async (
    connection: Connection,
    payer: Keypair,
    decimals: number
): Promise<PublicKey> => {
    return createMint(
        connection,
        payer, // payer
        payer.publicKey, // mint authority
        payer.publicKey, // freeze authority
        decimals // decimals of token
    );
};

/**
 * Creates or retrieves an associated token account
 * @param connection the connection to the solana blockchain
 * @param payer the keypair of the payer
 * @param mint the mint account
 * @returns public key of the token account
 */
export const CreateTokenAccount = async (
    connection: Connection,
    payer: Keypair,
    mint: PublicKey
): Promise<PublicKey> => {
    return getOrCreateAssociatedTokenAccount(
        connection,
        payer, // payer
        mint, // mint account (PublicKey returned by MintTokens)
        payer.publicKey // owner
    );
};

/**
 * Transfers tokens from one token account to another
 * @param connection the connection to the solana blockchain
 * @param owner the keypair of the owner
 * @param source the source token account
 * @param destination the destination token account
 * @param amount the amount of tokens to transfer
 * @returns the transaction signature
 */
export const TransferTokens = async (
    connection: Connection,
    owner: Keypair,
    source: PublicKey,
    destination: PublicKey,
    amount: number
): Promise<TransactionSignature> => {
    return transfer(
        connection,
        owner, // payer
        source, // source token account
        destination, // token account receiving the tokens
        owner, // owner of the token account
        amount
    );
};

export const BurnTokens = () => {};

export const ChangeOwnerOfATA = () => {};
