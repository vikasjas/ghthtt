

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Users from './Users';
import Profile from './Profile';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // On mount, try to load token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, []);

  // Custom onLogin handler
  const handleLogin = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    window.location.href = '/profile'; // force redirect after login
  };

  return (
    <Router>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link> | <Link to="/users">Users</Link> | <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={() => {}} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={token ? <Profile token={token} /> : <div>Please log in</div>} />
        <Route path="/" element={<div><h1>Dating App</h1><p>Welcome to the dating app!</p></div>} />
      </Routes>
    </Router>
  );
}

export default App;
