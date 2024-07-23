import { Connection, Keypair } from '@solana/web3.js';

const figlet = require("figlet");

console.log(figlet.textSync("Solana CLI", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default"
}));
