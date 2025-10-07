import React, { useState } from 'react';
import TicketList from './TicketList';
import TicketForm from './TicketForm';
import './Dashboard.css';

/**
 * Componente principal que renderiza los menús y vistas según el rol del usuario.
 *
 * Props:
 *  - role: Rol del usuario autenticado
 *  - token: Token de autenticación (no se usa directamente pero queda disponible)
 *  - onLogout: Función para cerrar sesión
 */
export default function Dashboard({ role, token, onLogout }) {
  // Configuración de menús y componentes por rol
  const menuConfig = {
    Administrador: [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'settings', label: 'Configuración' },
      { key: 'reports', label: 'Reportes' },
      { key: 'tickets', label: 'Tickets', component: <TicketList token={token} /> },
      { key: 'users', label: 'Usuarios' }
    ],
    Tecnico: [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'assigned', label: 'Tickets asignados', component: <TicketList token={token} /> },
      { key: 'settings', label: 'Configuración' }
    ],
    Solicitante: [
      { key: 'dashboard', label: 'Inicio' },
      { key: 'new-ticket', label: 'Nuevo ticket', component: <TicketForm token={token} /> },
      { key: 'my-tickets', label: 'Mis tickets', component: <TicketList token={token} /> },
      { key: 'faq', label: 'FAQ' },
      { key: 'settings', label: 'Configuración' }
    ]
  };

  const menus = menuConfig[role] || [];
  const [activeMenu, setActiveMenu] = useState(menus[0]?.key || '');

  // Renderiza contenido principal según la sección activa
  const renderContent = () => {
    const current = menus.find(m => m.key === activeMenu);
    if (!current) {
      return <Placeholder label="Sección" />;
    }
    if (current.key === 'dashboard') {
      return (
        <div className="dashboard-home">
          <h2>Bienvenido, {role}</h2>
          <div className="card-grid">
            {menus
              .filter(m => m.key !== 'dashboard')
              .map(m => (
                <div
                  key={m.key}
                  className="nav-card"
                  onClick={() => setActiveMenu(m.key)}
                >
                  <span>{m.label}</span>
                </div>
              ))}
          </div>
        </div>
      );
    }
    if (current.component) {
      return current.component;
    }
    return <Placeholder label={current.label} />;
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <nav>
          {menus.map(item => (
            <button
              key={item.key}
              className={`menu-btn ${activeMenu === item.key ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.key)}
            >
              {item.label}
            </button>
          ))}
          <button className="menu-btn logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </nav>
      </aside>
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

// Componente de marcador de posición para secciones no implementadas
function Placeholder({ label }) {
  return (
    <div className="placeholder">
      Sección "{label}" en construcción
    </div>
  );
}
