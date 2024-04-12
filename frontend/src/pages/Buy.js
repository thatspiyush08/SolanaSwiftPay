import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Buy.css';

function Buy() {
  const [currency, setCurrency] = useState('Solana');
  const [amount, setAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState({
    Solana: 0.02,  // Example exchange rate: 1 USD = 0.02 SOL
    Ethereum: 0.003,
    Polygon: 0.05,
    Bitcoin: 0.000025
  });
  const [userBalance, setUserBalance] = useState(0);

  const publicKey = localStorage.getItem("publicKey");

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const calculateCryptoAmount = () => {
    return amount ? (parseFloat(amount) * exchangeRate[currency]).toFixed(6) : '0.000000';
  };

  const fetchBalance = async () => {
    if (publicKey) {
      try {
        const response = await axios.post('http://localhost:8000/getBalance', { publicKey });
        setUserBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  };

  const handleBuy = async () => {
    if (!publicKey || !amount || !currency) {
      alert('Please fill all the fields correctly.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/addCoins', {
        publicKey,
        amount: parseFloat(amount*exchangeRate[currency]),
        type: currency.toLowerCase()
      });
      alert('Purchase successful: ' + response.data.message);
      fetchBalance();  
    } catch (error) {
      alert('Purchase failed: ' + error.response.data.error);
      console.error('Error buying coins:', error);
    }
  };

  return (
    
    <div className="balance-page">
      <div className="transaction-section">
        <div className="balance-display">
          Your Balance: <span className="balance-amount">${userBalance.toFixed(2)}</span>
        </div>
        <input
          type="number"
          placeholder="Enter amount in USD"
          value={amount}
          onChange={handleAmountChange}
        />
        <select value={currency} onChange={handleCurrencyChange}>
          <option value="Solana">Solana</option>
          <option value="Ethereum">Ethereum</option>
          <option value="Polygon">Polygon</option>
          
        </select>
        <div className="crypto-amount">
          You'll get: {calculateCryptoAmount()} {currency}
        </div>
        <button className="buy-now" onClick={handleBuy}>Buy Now</button>
      </div>
    </div>
  );
}

export default Buy;
