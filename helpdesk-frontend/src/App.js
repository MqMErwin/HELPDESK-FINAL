import React, { useState } from 'react';
import Login from './components/Login';
import ChatBotWidget from './components/ChatBotWidget';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import TechnicianDashboard from './components/TechnicianDashboard';
import UserDashboard from './components/UserDashboard';
import './App.css';

// Extrae el ID de usuario desde un JWT sin validarlo en el cliente
function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (
      payload['nameid'] ||
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      payload['sub'] ||
      null
    );
  } catch (e) {
    return null;
  }
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [rol, setRol] = useState(localStorage.getItem('rol') || null);
  const [userId, setUserId] = useState(
    localStorage.getItem('userId') || getUserIdFromToken(localStorage.getItem('token'))
  );
  const [showRegister, setShowRegister] = useState(false);
  const validRoles = ['Solicitante', 'Tecnico', 'Administrador'];

  const handleLogin = (token, rol) => {
    const normalizedRole = rol
      ? rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase()
      : '';
    const id = getUserIdFromToken(token);
    setToken(token);
    setRol(normalizedRole);
    setUserId(id);
    localStorage.setItem('token', token);
    localStorage.setItem('rol', normalizedRole);
    if (id) localStorage.setItem('userId', id);
  };

  const handleLogout = () => {
    setToken(null);
    setRol(null);
    setUserId(null);
    localStorage.clear();
  };

  if (!token || !validRoles.includes(rol)) {
    return (
      <div>
        {showRegister ? (
          <Register onBack={() => setShowRegister(false)} />
        ) : (
          <Login onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />
        )}
        <ChatBotWidget userId={userId} />
      </div>
    );
  }

  const renderDashboard = () => {
    switch (rol) {
      case 'Administrador':
        return <AdminDashboard onLogout={handleLogout} token={token} role={rol} />;
      case 'Tecnico':
        return <TechnicianDashboard onLogout={handleLogout} token={token} role={rol} />;
      case 'Solicitante':
        return <UserDashboard onLogout={handleLogout} token={token} role={rol} />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderDashboard()}
      <ChatBotWidget userId={userId} />
    </>
  );
}

export default App;
