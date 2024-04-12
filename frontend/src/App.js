// App.js
import Home from './pages/Home';
import React from 'react';
import './App.css';
import Login from './pages/Login';
import Send from './pages/Send';
import Buy from './pages/Buy';
import AddMoney from './pages/AddMoney';
import SignUp from './pages/SignUp';
import KeysDisplay from './pages/KeysDisplay';
import {BrowserRouter,Routes, Route, useNavigate} from 'react-router-dom'

function App() {
  return (
    <div>
      
      <BrowserRouter>
    <Routes>
    <Route path="/" element={<SignUp/>}/>
      <Route path="/Login" element={<Login/>}/>
    <Route path="/Home" element={<Home/>}/>
    <Route path="/Send" element={<Send/>}/>
    <Route path="/Buy" element={<Buy/>}/>
    <Route path="/AddMoney" element={<AddMoney/>}/>
    <Route path="/KeysDisplay" element={<KeysDisplay/>}/>
    </Routes>
    </BrowserRouter>
    </div>
  );
}



export default App;
