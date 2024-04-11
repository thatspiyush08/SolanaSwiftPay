import React, { useState } from 'react';
import './Home.css';

function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`home ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="sidebar" style={{ width: isSidebarOpen ? '250px' : '0' }}>
        <a href="www.google.com" className="sidebar-item">View Profile</a>
        <a href="www.google.com" className="sidebar-item">Edit Account</a>
        {/* More sidebar items... */}
      </div>
      <div className="navbar">
        <div className="nav-item">
          <div className="menu-icon" onClick={toggleSidebar}>≡</div>
          <div className="account-info">
            <div className="account-number">P1</div>
            <div className="account-name">Piyush</div>
          </div>
        </div>
        <div className="nav-item warning">⚠ Solana is experiencing network congestion</div>
      </div>
      <div className="content">
        <div className="balance-info">
          <div className="balance-amount">$ 100.00</div>
          <div className="balance-change">+$ 0.00 (+0.00%)</div>
        </div>
        <div className="action-buttons">
          <button className="action-btn send">Send</button>
          <button className="action-btn receive">Receive</button>
          <button className="action-btn buy">Buy</button>
        </div>
        <div className="currency-list">
          <CurrencyCard currency="Solana" symbol="SOL" />
          <CurrencyCard currency="Ethereum" symbol="ETH" />
          <CurrencyCard currency="Polygon" symbol="MATIC" />
        </div>
      </div>
    </div>
  );
}

function CurrencyCard({ currency, symbol }) {
  return (
    <div className="currency-card">
      <div className="currency-logo"></div>
      <div className="currency-details">
        <div className="currency-name">{currency}</div>
        <div className="currency-amount">0 {symbol} ($0.00)</div>
      </div>
    </div>
  );
}

export default Home;
