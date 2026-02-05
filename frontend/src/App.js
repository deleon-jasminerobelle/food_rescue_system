import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import PostFood from './components/PostFood';
import FoodList from './components/FoodList';
import ClaimFood from './components/ClaimFood';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('login');

  useEffect(() => {
    if (token) {
      setView('foodList');
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('login');
  };

  return (
    <div className="App">
      {!token ? (
        <div>
          {view === 'login' && <Login setToken={setToken} setView={setView} />}
          {view === 'register' && <Register setToken={setToken} setView={setView} />}
        </div>
      ) : (
        <div>
          <nav className="navbar">
            <h1>FoodShare</h1>
            <div className="nav-buttons">
              <button className="btn btn-secondary" onClick={() => setView('postFood')}>
                Post Food
              </button>
              <button className="btn btn-secondary" onClick={() => setView('foodList')}>
                View Foods
              </button>
              <button className="btn btn-secondary" onClick={logout}>
                Logout
              </button>
            </div>
          </nav>
          <div className="container">
            {view === 'postFood' && <PostFood />}
            {view === 'foodList' && <FoodList />}
            {view === 'claimFood' && <ClaimFood />}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
