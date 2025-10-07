import React, { useState } from 'react';
import './Login.css';
import logoEmi from '../assets/ESCUELA-MILITAR-DE-INGENIERIA.png';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';

export default function Login({ onLogin, onShowRegister }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
      });

      if (!response.ok) {
        setError('Credenciales invalidas');
        return;
      }

      const data = await response.json();
      onLogin(data.token, data.role || 'Usuario');
    } catch (err) {
      setError('Error de conexion');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <img src={logoEmi} alt="Logo EMI" className="login-logo" />

        <h2 className="login-title">Iniciar sesion</h2>
        {error && <p className="login-error">{error}</p>}

        <label>Correo</label>
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <label>Contrasena</label>
        <input
          type="password"
          placeholder="Contrasena"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
        <p className="register-link">
          Aun no tienes cuenta?{' '}
          <button type="button" className="link-button" onClick={onShowRegister}>
            Registrate
          </button>
        </p>
      </form>
    </div>
  );
}
