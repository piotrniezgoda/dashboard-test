import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import logo from './logo.svg';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const authToken = localStorage.getItem('auth_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://127.0.0.1:8000/sanctum/csrf-cookie').then(response => {
       fetch(
          'http://127.0.0.1:8000/api/login', {
            method: 'POST', 
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ username, password })
          })
          .then(response => response.json())
          .then(json => {
            localStorage.setItem('auth_token', json.token);
            navigate('/dashboard');
          })

        setUsername('');
        setPassword('');
      })
    } catch(error) {
      console.log(error)
    }
  };

  return (
    <div className="App-login">
      <div className="app-header">
        <h1>Logowanie</h1>
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
        <button disabled={!username || !password} className="submit-button" type="submit">Login</button>
      </form>
      <p className="register-info">
        Nie masz konta? 
        <a 
          href='/register'
          className="register-link"
        >
          Zarejestruj się!
        </a>
      </p>
    </div>
  );
}

export default App;
