import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddMoney.css';

function AddMoney() {
  const [amountToAdd, setAmountToAdd] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);  // State to hold the current balance
  const publicKey = localStorage.getItem("publicKey");  // Retrieve the public key from local storage

  useEffect(() => {
    fetchBalance();
  }, []); // Fetch balance when the component mounts

  const fetchBalance = async () => {
    if (publicKey) {
      try {
        const response = await axios.post('http://localhost:8000/getBalance', { publicKey });
        setCurrentBalance(response.data.balance);  // Update the current balance from the response
      } catch (error) {
        console.error('Error fetching balance:', error);
        alert('Failed to fetch balance');
      }
    }
  };

  const handleAddMoney = async (event) => {
    event.preventDefault();
    if (!publicKey) {
      alert('No public key found. Please ensure you are logged in.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/addBalance', {
        publicKey: publicKey,
        amount: parseFloat(amountToAdd)
      });
      alert('Money added successfully: ' + response.data.message);
      fetchBalance();  // Refresh the balance after successfully adding money
      setAmountToAdd('');  // Reset the input after transaction
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Failed to add money: ' + (error.response?.data?.error || 'Network Error'));
    }
  };

  return (
    <div className="add-money-container" style={{width:"600px",height:"700px"}}>
      <div className="add-money-card">
        <h2 className="add-money-title">Add Money</h2>
        <form className="add-money-form" onSubmit={handleAddMoney}>
          <div className="balance-info">
            Current Balance: $ {currentBalance.toFixed(2)}
          </div>
          <div className="input-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount to add"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="add-money-button">Add</button>
        </form>
      </div>
    </div>
  );
}

export default AddMoney;
