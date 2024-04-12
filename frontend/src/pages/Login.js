

import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/checkaccount', {
        publicKey: username,
        password: password
      });

      if (response.data && response.data.publicKey) {
        // Assuming that the API directly confirms the existence of the account by returning the public key
        localStorage.setItem('publicKey', response.data.publicKey);
        navigate('/Home');
      } else {
        // Clear the inputs and show an error
        setUsername('');
        setPassword('');
        setErrorMessage('Invalid password or Key');
      }
    } catch (error) {
      console.error('Login error:', error);
      setUsername('');
      setPassword('');
      setErrorMessage('Invalid password or Key');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-content">
          <h2 className="login-title">Welcome</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                id="publickey"
                placeholder="Public Key"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                id="password"
                placeholder={errorMessage || "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="login-button">Log In</button>
              <button className="login-button" onClick={() => navigate("/")}>Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
