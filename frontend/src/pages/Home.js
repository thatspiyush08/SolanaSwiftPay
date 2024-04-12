import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [coins, setCoins] = useState({});
  const publicKey = localStorage.getItem("publicKey");

  useEffect(() => {
    const fetchData = async () => {
      if (publicKey) {
        try {
          const balanceResponse = await axios.post('http://localhost:8000/getBalance', { publicKey });
          setBalance(balanceResponse.data.balance);
          const coinsResponse = await axios.post('http://localhost:8000/getCoins', { publicKey });
          setCoins(coinsResponse.data.coins);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [publicKey]);

  return (
    <div className="home">
      <div className="navbar">
        
        
      </div>
      <div className="content">
        <div className="balance-info">
          <div className="balance-title">Wallet Balance :</div>
          <div className="balance-amount">$ {balance.toFixed(2)}</div>
        </div>
        <div className="action-buttons">
          <button className="action-btn send" onClick={() => navigate("/Send")}>Send</button>
          <button className="action-btn add-money" onClick={() => navigate("/AddMoney")}>Add Money</button>
          <button className="action-btn buy" onClick={() => navigate("/Buy")}>Buy</button>
        </div>
        <div className="currency-list">
          {Object.entries(coins).map(([currency, amount]) => (
            currency.toUpperCase() !== "BITCOIN" && (
              <CurrencyCard key={currency} currency={currency} amount={amount} />
            )
          ))}
        </div>
      </div>
    </div>
  );
}

function CurrencyCard({ currency, amount }) {
  const coinRates = { "solana": 50, "ethereum": 333.3333, "polygon": 20 };
  return (
    <div className="currency-card">
      <div className="currency-logo">{currency[0]}</div>
      <div className="currency-details">
        <div className="currency-name">{currency.toUpperCase()}</div>
        <div className="currency-amount">$ {amount * coinRates[currency.toLowerCase()]} </div>
      </div>
    </div>
  );
}

export default Home;
