import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Components/Pages/Register';
import Login from './Components/Pages/Login'
import LandingPage from './Components/Pages/LandingPage'
import Dashboard from './Components/Pages/Dashboard';
import MatchArena from './Components/Pages/MatchMaking';

const App = () => {
  return (
    <div className="min-h-screen font-poppins" style={{ backgroundColor: "#121212" }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
