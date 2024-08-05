import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import React, { FC, useState } from "react";
import styles from "../styles/Home.module.css";
import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
} from "@solana/web3.js";
import {
    createMint,
    TOKEN_PROGRAM_ID,
    MINT_SIZE,
    getMinimumBalanceForRentExemptMint,
    createInitializeMintInstruction,
} from "@solana/spl-token";

interface TokenMintFormProps {
    tokenMintPubKey: PublicKey | null;
    setTokenMintPubKey: React.Dispatch<React.SetStateAction<PublicKey | null>>;
}

export const TokenMintForm: FC<TokenMintFormProps> = ({
    tokenMintPubKey,
    setTokenMintPubKey,
}) => {
    const [decimals, setDecimals] = useState(0);

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const buildCreateMintTransaction = async (
        connection: Connection,
        payer: PublicKey,
        decimals: number
    ): Promise<{ transaction: Transaction; mintPublicKey: PublicKey }> => {
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const accountKeypair = Keypair.generate();
        const programId = TOKEN_PROGRAM_ID;

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: accountKeypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId,
            }),
            createInitializeMintInstruction(
                accountKeypair.publicKey,
                decimals,
                payer,
                payer,
                programId
            )
        );

        return {
            transaction: transaction,
            mintPublicKey: accountKeypair.publicKey,
        };
    };

    const HandleTokenMint = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!publicKey) throw new WalletNotConnectedError();
        const { transaction, mintPublicKey } = await buildCreateMintTransaction(
            connection,
            publicKey,
            decimals
        );

        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction, connection, {
            minContextSlot,
        });
        await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature,
        });
        setTokenMintPubKey(mintPublicKey);
    };

    return (
        <div>
            <label>Decimals:</label>
            <input
                id="decimals"
                name="decimals"
                type="number"
                min="0"
                max="9"
                onChange={(e) => setDecimals(parseInt(e.target.value))}
                value={decimals}
            />
            <button onClick={HandleTokenMint}>Mint Token</button>
            {tokenMintPubKey && (
                <label>Token Mint Pubkey: {tokenMintPubKey?.toBase58()}</label>
            )}
        </div>
    );
};
