# session_1: Flare CLI
## Goal:
Create a command line interface tool with the following capabilities:
1. Create new Keypairs
2. Request Airdrops
3. Send SOL from one wallet to another
4. Show balance of a wallet

## Features:
### Creating New Keypairs
Usage: ```bash // flare generate [-o <file>]```

Creates a new private and public key. If an outfile is specified, the string representations as well as byte arrays are saved to it. Otherwise, both public and private key are written to the terminal.
