const express = require('express');
const bodyParser = require('body-parser');
const {
    Connection,
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    clusterApiUrl // Add this line
} = require('@solana/web3.js');


const app = express();
const port = 8000;

app.use(bodyParser.json());

// Solana connection
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// In-memory wallet storage for demo purposes
let wallets = {};

// Function to create a new wallet
app.post('/createWallet', async (req, res) => {
    const newWallet = new Keypair();
    const publicKeyString = new PublicKey(newWallet.publicKey);
    wallets[publicKeyString] = newWallet;

    res.json({
        message: 'Wallet created successfully',
        publicKey: publicKeyString,
        privateKey: [...newWallet.secretKey]
    });
});

// Function to get wallet balance
app.post('/getBalance', async (req, res) => {
    try {
        const { publicKey } = req.body;
        const balance = await connection.getBalance(new PublicKey(publicKey));
        res.json({ balance: balance / LAMPORTS_PER_SOL });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get the balance' });
    }
});



// Function to add money to the wallet
app.post('/addMoney', async (req, res) => {
    try {
        const { publicKey, amount } = req.body;
        const wallet = wallets[publicKey];

        if (!wallet) {
            return res.status(400).json({ error: 'Wallet not found' });
        }

        await transferSol(new Keypair(wallet.secretKey), publicKey, amount);
        res.json({ message: `Added ${amount} SOL to wallet` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add money' });
    }
});

// Function to remove money from the wallet
app.post('/reduceMoney', async (req, res) => {
    try {
        const { publicKey, amount } = req.body;
        const wallet = wallets[publicKey];

        if (!wallet) {
            return res.status(400).json({ error: 'Wallet not found' });
        }

        const receiverWallet = new Keypair();
        await transferSol(new Keypair(wallet.secretKey), receiverWallet.publicKey, amount);
        res.json({ message: `Reduced ${amount} SOL from wallet` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove money' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
