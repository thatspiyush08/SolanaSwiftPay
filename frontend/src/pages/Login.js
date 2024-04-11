// Login.js

import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Authentication logic goes here
    console.log('Login submitted:', username, password);
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
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
