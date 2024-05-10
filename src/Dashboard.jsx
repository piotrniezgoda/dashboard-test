import React, { useEffect, useState, confirm } from 'react';
import { useNavigate } from "react-router-dom";


import logo from './logo.svg';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        isAuth: false,
        page: '',
        timestamp: null,
    });
    const authToken = localStorage.getItem('auth_token');
    const [timestamp, setTimestamp] = useState(Date.now());

    useEffect(() => {
        if (!authToken) navigate('/');

        fetch(
            'http://127.0.0.1:8000/api/dashboard', {
            method: 'GET', 
            headers: {
              "content-type": "application/json",
              'Authorization': `Bearer ${authToken}`
            }
        })
        .then(data => data.json())
        .then(json => setData(json));

    }, [timestamp])

    const logout = () => {
        localStorage.removeItem('auth_token');
        navigate('/');
    }

    const handleDelete = (user, isCurrentUser) => {
        if (!isCurrentUser && window.confirm('Czy na pewno chcesz usunąć użytkownika: ' + user.username)) {
            fetch(
                'http://127.0.0.1:8000/api/user/delete', {
                method: 'POST', 
                headers: {
                  "content-type": "application/json",
                  'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ username: user.username, id: user.id })
            })
            .then(data => data.json())
            .then(json => {
                if (json.status === 'ok') {
                    setTimestamp(Date.now());
                }
            })
        }
    }

    return (
        <div className="App-dashboard">
        <p className="info-heading">Jesteś zalogowany jako <span className="span-green">{data.currentUser?.username}</span></p>

        <button onClick={logout} className="logout-button">
            Wyloguj
        </button>
        {data && data.isAuth && (
            <>
                <div className="info-box">
                    <p className="info-data"><span className="span-bold">użytkownik:</span> {data.isAuth ? <span style={{ color:"#bada55", fontWeight: "bold" }}>{data.currentUser.username}</span> : 'Brak autoryzacji'}</p>
                    <p className="info-data"><span className="span-bold">status:</span> {data.isAuth ? <span style={{ color:"#bada55", fontWeight: "bold" }}>Zalogowano</span> : 'Brak autoryzacji'}</p>
                    <p className="info-data"><span className="span-bold">strona:</span> {data.page}</p>
                    <p className="info-data"><span className="span-bold">timestamp:</span> {data.timestamp}</p>
                    <p className="info-data"><span className="span-bold">czas zalogowania:</span> {Date(data.timestamp)}</p>
                </div>
                <div className="users-list">
                    <h2 className="section-title">Lista użytkowników</h2>
                    <ul className="users-list">
                        {data.users?.map(user => {
                            const isCurrentUser = data.currentUser.username === user.username;
                            return (
                                <li className={isCurrentUser ? "users-list-element users-list-element-active" : "users-list-element"}>
                                    {isCurrentUser && (
                                        <p style={{ textAlign: "center", width: "100%", marginBottom: "1em" }}>(zalogowany użytkownik)</p>
                                    )}
                                    <p><span className="span-bold">Nazwa użytkownika:</span> {user.username}</p>
                                    <p><span className="span-bold">Data utworzenia:</span> {user.created_at}</p>
                                    <p><span className="span-bold">ID:</span> {user.id}</p>
                                    {!isCurrentUser && (
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleDelete(user, isCurrentUser)}
                                        >
                                            Usuń
                                        </button>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </>
        )}
        </div>
    );
}

export default Dashboard;
