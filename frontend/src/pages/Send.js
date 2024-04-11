// Send.js

import React, { useState } from 'react';
import './Send.css';

function Send({ balance }) {
  const [receiverKey, setReceiverKey] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Insert sending logic here
    console.log('Sending', amount, 'to', receiverKey);
  };

  return (
    <div className="send-container">
      <div className="send-card">
        <h2 className="send-title">Send Funds</h2>
        <div className="balance-info">
          <span className="balance-label">Your Balance:</span>
          <span className="balance-amount">${balance}</span>
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
          <button type="submit" className="send-button">Send Now</button>
        </form>
      </div>
    </div>
  );
}

export default Send;
