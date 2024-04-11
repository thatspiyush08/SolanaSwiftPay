import React, { useState } from 'react';
import './Buy.css';

function Buy() {
  const [currency, setCurrency] = useState('Solana');
  const [amount, setAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState({
    Solana: 0.02, // Example exchange rate: 1 USD = 0.02 SOL
    Ethereum: 0.003,
    Polygon: 0.05,
    Bitcoin: 0.000025
  });

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const calculateCryptoAmount = () => {
    return amount ? (parseFloat(amount) * exchangeRate[currency]).toFixed(6) : '0.000000';
  };

  return (
    <div className="balance-page">
      
      <div className="transaction-section">
      <div className="balance-display">
        Your Balance: <span className="balance-amount">$100</span>
      </div>
        <input
          type="number"
          placeholder="Enter amount in Rupees"
          value={amount}
          onChange={handleAmountChange}
        />
        <select value={currency} onChange={handleCurrencyChange}>
          <option value="Solana">Solana</option>
          <option value="Ethereum">Ethereum</option>
          <option value="Polygon">Polygon</option>
          <option value="Bitcoin">Bitcoin</option>
        </select>
        <div className="crypto-amount">
          
          You'll get : {calculateCryptoAmount()} {currency}
        </div>
        <button className="buy-now" onClick={() => console.log('Buying...')}>Buy Now</button>
      </div>
    </div>
  );
}

export default Buy;
