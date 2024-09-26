// Importing necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, clusterApiUrl } = require('@solana/web3.js');

// Creating an Express application
const app = express();
const port = 8000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
const cors = require('cors'); // Importing CORS for cross-origin requests
app.use(cors()); // Enabling CORS for all routes

// Establishing a connection to the Solana devnet
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// In-memory storage for wallets, coins, balances, and accounts
let wallets = {};
let coins = {};
let balance = {};
let accounts = {};

// Function to create a new wallet
app.post('/createWallet', async (req, res) => {
    const { name, number, password } = req.body; // Extracting data from the request body
    // Check if required fields are provided
    if (!name || !number || !password) {
        return res.status(400).json({ error: 'Name, number, password not provided' });
    }
    // Generate a new wallet using Keypair
    const newWallet = new Keypair();
    const publicKeyString = new PublicKey(newWallet.publicKey).toBase58(); // Convert to string for response
    // Store wallet and account information
    wallets[publicKeyString] = newWallet;
    coins[publicKeyString] = { "solana": 0, "ethereum": 0, "bitcoin": 0, "polygon": 0 }; // Initial coin balances
    balance[publicKeyString] = 0;  // Initial balance set to 0
    accounts[publicKeyString] = { "name": name, "number": number, "password": password }; // Storing account details
    // Respond with success message and wallet information
    res.json({
        message: 'Wallet created successfully',
        publicKey: publicKeyString,
        privateKey: [...newWallet.secretKey] // Return private key (handle with care in production)
    });
});

// Function to check account validity
app.post("/checkaccount", async (req, res) => {
    const { publicKey, password } = req.body; // Extracting public key and password from request body
    // Validate account credentials
    if (accounts[publicKey] && accounts[publicKey]["password"] === password) {
        res.json({ publicKey: publicKey }); // Respond with public key if valid
    } else {
        res.status(400).json("Invalid public key or password"); // Respond with error if invalid
    }
});

// Function to add SOL to the wallet via airdrop
app.post('/addSol', async (req, res) => {
    try {
        const { publicKey, amount } = req.body; // Extracting public key and amount from request body
        const wallet = wallets[publicKey]; // Retrieve wallet from stored wallets
        if (!wallet) {
            return res.status(400).json({ error: 'Wallet not found' }); // Error if wallet does not exist
        }
        // Check if there is enough balance to perform the airdrop
        if (balance[publicKey] < amount * LAMPORTS_PER_SOL * 50) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        // Convert publicKey string to PublicKey object
        const publicKeyObj = new PublicKey(publicKey);
        // Request an airdrop of SOL
        const fromAirDropSignature = await connection.requestAirdrop(publicKeyObj, amount * LAMPORTS_PER_SOL);
        // Confirm the transaction
        await connection.confirmTransaction(fromAirDropSignature);
        // Update the coin and balance records
        coins[publicKey]["solana"] += amount * LAMPORTS_PER_SOL;
        balance[publicKey] -= amount * 50; // Deduct from the balance (considering operational cost)
        res.json({ message: "Airdrop successful!" }); // Success response
    } catch (error) {
        console.error("Error during airdrop:", error);
        res.status(500).json({ error: "Error during airdrop: " + error.message }); // Error response on failure
    }
});

// Function to transfer SOL from one wallet to another
app.post('/transferMoney', async (req, res) => {
    try {
        const { senderKey, receiverKey, amount } = req.body; // Extracting data from request body
        const senderWallet = wallets[senderKey]; // Retrieve sender's wallet
        const receiverPublicKey = new PublicKey(receiverKey); // Convert receiver's public key string to PublicKey object

        if (!senderWallet) {
            return res.status(400).json({ error: 'Sender wallet not found' }); // Error if sender's wallet does not exist
        }

        // Get the sender's balance
        const senderBalance = await connection.getBalance(senderWallet.publicKey);
        if (senderBalance < amount * LAMPORTS_PER_SOL) {
            return res.status(400).json({ error: 'Insufficient balance' }); // Error if balance is insufficient
        }

        // Create a transaction to transfer SOL
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderWallet.publicKey, // Sender's public key
                toPubkey: receiverPublicKey, // Receiver's public key
                lamports: amount * LAMPORTS_PER_SOL // Amount in lamports (1 SOL = 1,000,000,000 lamports)
            })
        );

        // Send and confirm the transaction
        const signature = await sendAndConfirmTransaction(connection, transaction, [senderWallet]);
        res.json({ message: `Transferred ${amount} SOL from sender to receiver`, signature: signature }); // Success response with transaction signature
    } catch (error) {
        res.status(500).json({ error: 'Failed to transfer money' }); // Error response on failure
    }
});

// Function to get the balance of a wallet
app.post('/getBalance', async (req, res) => {
    const { publicKey } = req.body; // Extracting public key from request body
    // Check if the public key is provided and valid
    if (!publicKey || !balance.hasOwnProperty(publicKey)) {
        return res.status(400).json({ error: 'Public key not provided or invalid' });
    }
    res.json({ balance: balance[publicKey] }); // Respond with the current balance
});

// General function to add different types of coins
app.post('/addCoins', async (req, res) => {
    const { publicKey, amount, type } = req.body; // Extracting data from request body
    // Define the conversion rates for different coins
    const coinRates = { "solana": 50, "ethereum": 333.3333, "bitcoin": 40000, "polygon": 20 };
    // Validate input data
    if (!amount || !type || !publicKey) {
        return res.status(400).json({ error: 'Amount, type or publicKey not provided' });
    }

    // Check if the user has enough balance and a valid public key
    if (!coins[publicKey] || !balance[publicKey] || (balance[publicKey] < amount * coinRates[type])) {
        return res.status(400).json({ error: 'Insufficient balance or invalid publicKey' });
    }

    // Update the user's coin balance and deduct the amount from their balance
    coins[publicKey][type] += amount;
    balance[publicKey] -= amount * coinRates[type];
    res.json({ message: `Added ${amount} ${type} successfully` }); // Success response
});

// Function to get the coins held in a wallet
app.post('/getCoins', async (req, res) => {
    const { publicKey } = req.body; // Extracting public key from request body
    
    // Check if the public key is valid
    if (!coins[publicKey]) {
        return res.status(400).json({ error: 'Invalid publicKey' });
    }
    
    res.json({ coins: coins[publicKey] }); // Respond with the coins held
});

// Function to add generic currency balance to a wallet
app.post('/addBalance', async (req, res) => {
    const { publicKey, amount } = req.body; // Extracting public key and amount from request body
    // Check if the public key is valid
    if (!publicKey || !balance.hasOwnProperty(publicKey)) {
        return res.status(400).json({ error: 'Public key not provided or invalid' });
    }
    // Update the balance
    balance[publicKey] += amount;
    res.json({ message: "Added balance successfully" }); // Success response
});

// Function to send coins between wallets
app.post('/sendCoins', async (req, res) => {
    const { sender, receiver, amount, type } = req.body; // Extracting data from request body
    const coinRates = { "solana": 50, "ethereum": 333.3333, "bitcoin": 40000, "polygon": 20 }; // Define conversion rates
    // Validate input data
    if (!amount || !type || !sender || !receiver) {
        return res.status(400).json({ error: 'Amount, type, sender or receiver not provided' });
    }
    // Check if the sender has sufficient balance for the specified coin type
    if (coins[sender][type] < amount) {
        return res.status(400).json({ error: 'Insufficient coin balance' });
    }
    // Transfer coins between sender and receiver
    coins[sender][type] -= amount; // Deduct from sender
    coins[receiver][type] += amount; // Add to receiver
    res.json({ message: `Transferred ${amount} ${type} from ${sender} to ${receiver}` }); // Success response
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`); // Log server startup
});
