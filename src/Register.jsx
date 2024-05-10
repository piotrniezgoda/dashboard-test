import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import logo from './logo.svg';
import './Register.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [data, setData] = useState({
    status: '',
  });
  const navigate = useNavigate();

  const authToken = localStorage.getItem('auth_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://127.0.0.1:8000/sanctum/csrf-cookie').then(response => {
       fetch(
          'http://127.0.0.1:8000/api/register', {
            method: 'POST', 
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ username, password })
          })
          .then(response => response.json())
          .then(json => {
            setData(json)
          })

        setUsername('');
        setPassword('');
      })
    } catch(error) {
      console.log(error)
    }
  };

  const MessageModal = () => {
    setTimeout(() => {
      navigate('/')
    }, 3000);
    
  
    return (
        <div className='status-modal'>
          <div className="modal-inner">
            <p className="status-message message-main">Rejestracja przebiegła pomyślnie!</p>
            <p className="status-message message-second">Za chwilę zostaniesz przeniesiony do strony logowania</p>
          </div>
        </div>
    )
  }

  return (
    <div className="App-register">
      <a href="/" className="back-link">Powrót</a>
      <div className="app-header">
        <h1>Rejestracja</h1>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-container">
          <label className="input-label" htmlFor="username">Login:</label>
          <input
          className="input"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="password">Hasło:</label>
          <input
          className="input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button disabled={!username || !password} className="submit-button" type="submit">Rejestruj</button>
      </form>
      {data.status === 'ok' && <MessageModal />}
    </div>
  );
}

export default App;
