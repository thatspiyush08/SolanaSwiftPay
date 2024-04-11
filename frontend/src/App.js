// App.js
import Home from './pages/Home';
import React from 'react';
import './App.css';
import Login from './pages/Login';
import Send from './pages/Send';
import Buy from './pages/Buy';

function App() {
  return (
    <div>
      <Buy />
      {/* <Send balance={100} /> */}
      {/* <Home /> */}
      {/* <Login /> */}
    </div>
  );
}



export default App;
