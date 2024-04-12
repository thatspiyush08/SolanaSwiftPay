import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Send.css';

function Send() {
  const [receiverKey, setReceiverKey] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState(''); // No default selection
  const [balance, setBalance] = useState(0);
  const publicKey = localStorage.getItem("publicKey");

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await axios.post('http://localhost:8000/getBalance', { publicKey });
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (paymentMode === 'dollar') {
      try {
        const response = await axios.post('http://localhost:8000/sendMoney', {
          sender: publicKey,
          receiver: receiverKey,
          amount: parseFloat(amount)
        });
        alert('Transaction successful: ' + response.data.message);
      } catch (error) {
        alert('Transaction failed: ' + error.response.data.error);
        console.error('Error sending money:', error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:8000/sendCoins', {
          sender: publicKey,
          receiver: receiverKey,
          amount: parseFloat(amount),
          type: paymentMode
        });
        alert('Transaction successful: ' + response.data.message);
      } catch (error) {
        alert('Transaction failed: ' + error.response.data.error);
        console.error('Error sending coins:', error);
      }
    }
    fetchBalance(); // Update balance after transaction
  };

  return (
    <div className="send-container" style={{width:"800px"}}>
      <div className="send-card">
        <h2 className="send-title">Send Funds</h2>
        <div className="balance-info">
          <span className="balance-label" style={{marginBottom:"20px"}}>Wallet Balance:</span>
          <span className="balance-amount">${balance.toFixed(2)}</span>
        </div>
        <form className="send-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="receiverKey">Receiver Key</label>
            <input
              type="text"
              id="receiverKey"
              placeholder="Enter receiver's key"
              value={receiverKey}
              onChange={(e) => setReceiverKey(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount to send"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="paymentMode">Mode of Payment</label>
            <select
              id="paymentMode"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              required
            >
              <option value="" disabled>Please select</option>
              <option value="polygon">Polygon</option>
              <option value="ethereum">Ethereum</option>
              <option value="solana">Solana</option>
              <option value="dollar">Dollar</option>
            </select>
          </div>
          <button type="submit" className="send-button">Send Now</button>
        </form>
      </div>
    </div>
  );
}

export default Send;
