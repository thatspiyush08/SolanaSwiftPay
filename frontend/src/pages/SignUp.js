import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './SignUp.css';
import {useNavigate} from 'react-router-dom';

function SignUp() {
    const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    password: '',
    number: '', // Changed from phoneNumber to number to match the server's expected field
  });

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/createWallet', userData);
      console.log('Account created:', response.data);
      localStorage.setItem('publicKey', response.data.publicKey);
      localStorage.setItem('secretKey', response.data.privateKey);
        navigate('/KeysDisplay');
      // Clear form or redirect user as needed
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Failed to create account: ' + (error.response?.data?.error || 'Network Error'));
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Welcome</h1>
        <div className="input-group">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={userData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type={passwordShown ? 'text' : 'password'}
            name="password"
            className="password-input"
            placeholder="Password"
            value={userData.password}
            onChange={handleInputChange}
            required
          />
          <span className="eye-icon" style={{marginLeft:"25px"}}onClick={togglePasswordVisibility}>
            {passwordShown ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="input-group">
          <input
            type="tel"
            name="number" // Changed from phoneNumber to number
            placeholder="Phone Number"
            value={userData.number} // Changed from userData.phoneNumber to userData.number
            onChange={handleInputChange}
            required
          />
        </div>
        <div >
        <button type="submit" style={{marginRight:"20px"}}>Sign Up</button>
        <button onClick={() => navigate("/Login")}>Login</button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
