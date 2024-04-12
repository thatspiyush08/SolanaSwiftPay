import React, { useState, useEffect } from 'react';
import './KeysDisplay.css';
import { FaExclamationTriangle } from 'react-icons/fa'; // Import warning icon from react-icons
import { useNavigate } from 'react-router-dom';

function KeysDisplay() {
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch keys from local storage
    const storedPublicKey = localStorage.getItem('publicKey');
    const storedSecretKey = localStorage.getItem('secretKey');

    if (storedPublicKey && storedSecretKey) {
      setPublicKey(storedPublicKey);
      setSecretKey(storedSecretKey);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="keys-container">
      <div className="keys-card">
        <h1>Key Information</h1>
        <div className="key-details">
          <div className="key-info">
            <label>Public Key:</label>
            <div className="key-value">{publicKey || 'Not available'}</div>
          </div>
          <div className="key-info">
            <label>Secret Key:</label>
            <div className="key-value">{secretKey || 'Not available'}</div>
          </div>
        </div>
        <div className="key-warning">
          <FaExclamationTriangle className="warning-icon" />
          <p className="key-message">Please do not share your secret key with anybody.</p>
        </div>
        <button className="continue-button" onClick={() => navigate("/Login")}>Continue</button>
      </div>
    </div>
  );
}

export default KeysDisplay;
