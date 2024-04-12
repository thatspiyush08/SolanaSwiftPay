

const express = require('express');
const bodyParser = require('body-parser');
const { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, clusterApiUrl } = require('@solana/web3.js');

const app = express();
const port = 8000;

app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

// Solana connection
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

let wallets = {};
let coins = {};
let balance = {};
let accounts = {};

// Function to create a new wallet
app.post('/createWallet', async (req, res) => {
    const {name,number,password}=req.body;
    if (!name || !number || !password ) {
        return res.status(400).json({ error: 'Name, number, password  not provided' });
    }
    const newWallet = new Keypair();
    const publicKeyString = new PublicKey(newWallet.publicKey).toBase58(); // Convert to string for response
    wallets[publicKeyString] = newWallet;
    coins[publicKeyString] = {"solana": 0, "ethereum": 0, "bitcoin": 0, "polygon": 0};
    balance[publicKeyString] = 0;  //  balance  0
    accounts[publicKeyString]={"name":name,"number":number,"password":password};
    res.json({
        message: 'Wallet created successfully',
        publicKey: publicKeyString,
        privateKey: [...newWallet.secretKey]
    });
});



app.post("/checkaccount", async (req, res) => {
    const { publicKey,password } = req.body;
    if (accounts[publicKey] && accounts[publicKey]["password"] === password) {
        res.json({ publicKey: publicKey });
    }
    else{
        res.status(400).json("Invalid public key");
    }
});

// Function to add money to the wallet
app.post('/addSol', async (req, res) => {
    try {
        const { publicKey, amount } = req.body;
        const wallet = wallets[publicKey];
        if (!wallet) {
            return res.status(400).json({ error: 'Wallet not found' });
        }
        if (balance < amount*LAMPORTS_PER_SOL*50) {
        
            return res.status(400).json({ error: 'Insufficient balance' })};
        // Ensure publicKey is correctly used as a PublicKey object
        const publicKeyObj = new PublicKey(publicKey);
        const fromAirDropSignature = await connection.requestAirdrop(publicKeyObj, amount * LAMPORTS_PER_SOL);
        await connection.confirmTransaction(fromAirDropSignature);
        coins[publicKey]["solana"]+=amount*LAMPORTS_PER_SOL;
        balance[publicKey]-=amount*50;
        res.json({ message: "Airdrop successful!" });
    } catch (error) {
        console.error("Error during airdrop:", error);
        res.status(500).json({ error: "Error during airdrop: " + error.message });
    }
});

// Function to transfer money from one wallet to another
app.post('/transferMoney', async (req, res) => {
    try {
        const { senderKey, receiverKey, amount } = req.body;
        const senderWallet = wallets[senderKey];
        const receiverPublicKey = new PublicKey(receiverKey);

        if (!senderWallet) {
            return res.status(400).json({ error: 'Sender wallet not found' });
        }

        const senderBalance = await connection.getBalance(senderWallet.publicKey);
        if (senderBalance < amount * LAMPORTS_PER_SOL) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderWallet.publicKey,
                toPubkey: receiverPublicKey,
                lamports: amount * LAMPORTS_PER_SOL
            })
        );

        const signature = await sendAndConfirmTransaction(connection, transaction, [senderWallet]);
        res.json({ message: `Transferred ${amount} SOL from sender to receiver`, signature: signature });
    } catch (error) {
        res.status(500).json({ error: 'Failed to transfer money' });
    }
});

// Function to get wallet balance
app.post('/getBalance', async (req, res) => {
    const { publicKey } = req.body;
    if (!publicKey || !balance.hasOwnProperty(publicKey)) {
        return res.status(400).json({ error: 'Public key not provided or invalid' });
    }
    res.json({ balance: balance[publicKey] });
});

// General function to add coins
app.post('/addCoins', async (req, res) => {
    const { publicKey, amount, type } = req.body;
    const coinRates = { "solana": 50, "ethereum": 333.3333, "bitcoin": 40000, "polygon": 20 };
    if (!amount || !type || !publicKey) {
        return res.status(400).json({ error: 'Amount, type or publicKey not provided' });
    }

    if (!coins[publicKey] || !balance[publicKey] || (balance[publicKey] < amount * coinRates[type])) {
        return res.status(400).json({ error: 'Insufficient balance or invalid publicKey' });
    }

    coins[publicKey][type] += amount;
    balance[publicKey] -= amount * coinRates[type];
    res.json({ message: `Added ${amount} ${type} successfully` });
});

app.post('/getCoins', async (req, res) => {
    const { publicKey } = req.body;
    
    if (!coins[publicKey] ) {
        return res.status(400).json({ error: 'Invalid publicKey' });
    }
    
    res.json({ coins: coins[publicKey] });
    
});

// Function to add balance (generic currency units)
app.post('/addBalance', async (req, res) => {
    const { publicKey, amount } = req.body;
    if (!publicKey || !balance.hasOwnProperty(publicKey)) {
        return res.status(400).json({ error: 'Public key not provided or invalid' });
    }
    balance[publicKey] += amount;
    res.json({ message: "Added balance successfully" });
});

app.post('/sendCoins', async (req, res) => {
    const { sender, receiver, amount, type } = req.body;
    const coinRates = { "solana": 50, "ethereum": 333.3333, "bitcoin": 40000, "polygon": 20 };
    if (!amount || !type || !sender || !receiver) {
        return res.status(400).json({ error: 'Amount, type, sender or receiver not provided' });
    }

    if (!coins[sender] || !coins[receiver] || !coins[sender][type] || (coins[sender][type] < amount)) {
        return res.status(400).json({ error: 'Insufficient balance or invalid publicKey' });
    }

    coins[sender][type] -= amount;
    coins[receiver][type] += amount;
    res.json({ message: `Sent ${amount} ${type} successfully` });
});

app.post("/sendMoney", async (req, res) => {
    const { sender, receiver, amount } = req.body;
    if (!sender || !receiver || !amount) {
        return res.status(400).json({ error: 'Sender, receiver or amount not provided' });
    }

    if (!balance[sender] || (balance[sender] < amount)) {
        return res.status(400).json({ error: 'Insufficient balance or invalid publicKey' });
    }

    balance[sender] -= amount;
    balance[receiver] += amount;
    res.json({ message: `Sent ${amount} successfully` });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
