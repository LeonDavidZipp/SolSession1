import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

// import { Wallet } from "./components/wallet";
// import { SendSOLToRandomAddress } from "./components/randomButton";
import { PublicKey, Connection } from "@solana/web3.js";
import { AppBar } from "./components/AppBar";
import { TokenMintForm } from "./components/TokenMint";
import styles from "./styles/Home.module.css";

function App() {
    const [connection, setConnection] = useState<Connection>();
    const [pubKey, setPubkey] = useState<PublicKey | null>(null);
    const [tokenMintPubKey, setTokenMintPubKey] = useState<PublicKey | null>(
        null
    );
    const [ATAPubkey, setATAPubkey] = useState<PublicKey | null>(null);

    return (
        <div className={styles.App}>
            <AppBar />
            <h1>Vite + React</h1>
            {/* <div>
                <TokenMintForm
                    tokenMintPubKey={tokenMintPubKey}
                    setTokenMintPubKey={setTokenMintPubKey}
                />
            </div> */}
        </div>
    );
}

export default App;
