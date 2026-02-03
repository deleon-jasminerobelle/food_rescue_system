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
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ color: '#4CAF50', marginBottom: '30px' }}>Food Rescue System</h1>
            <div className="nav-buttons">
              <button className="btn btn-primary" onClick={() => setView('login')}>
                Login
              </button>
              <button className="btn btn-primary" onClick={() => setView('register')}>
                Register
              </button>
            </div>
          </div>
          {view === 'login' && <Login setToken={setToken} />}
          {view === 'register' && <Register setToken={setToken} />}
        </div>
      ) : (
        <div>
          <nav className="navbar">
            <h1>Food Rescue System</h1>
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
