import React, { useState } from 'react';
import './UserDashboard.css';
import TicketForm from './TicketForm';
import TicketList from './TicketList';
import {
  FiHome,
  FiPlus,
  FiList,
  FiLogOut,
  FiBell,
  FiMenu,
  FiX,
  FiChevronDown
} from 'react-icons/fi';

export default function UserDashboard({ onLogout, token, role }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('new');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Ticket actualizado', time: '1h', read: false }
  ];
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className={`user-dashboard ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <header className="user-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <h1>
            <span className="logo-part">HelpDesk</span>
            <span className="logo-emi">EMI</span>
          </h1>
        </div>

        <div className="header-right">
          <div className="notification-wrapper">
            <button
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FiBell />
              {unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notificaciones</h4>
                  <span className="mark-read">Marcar todas como leídas</span>
                </div>
                <div className="notification-list">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`notification-item ${n.read ? '' : 'unread'}`}
                    >
                      <div className="notification-dot"></div>
                      <div className="notification-content">
                        <p>{n.text}</p>
                        <span className="notification-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notification-footer">
                  <button type="button">Ver todas</button>
                </div>
              </div>
            )}
          </div>

          <div className="user-profile">
            <div className="avatar">U</div>
            <div className="user-info">
              <span className="user-name">Usuario</span>
              <span className="user-role">{role || 'Solicitante'}</span>
            </div>
            <FiChevronDown className="dropdown-icon" />
          </div>

          <button className="logout-button" onClick={onLogout}>
            <FiLogOut />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      <div className="user-content">
        <aside className="user-sidebar">
          <nav>
            <ul>
              <li className={activeMenu === 'dashboard' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveMenu('dashboard')}>
                  <FiHome className="icon" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li className={activeMenu === 'new' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveMenu('new')}>
                  <FiPlus className="icon" />
                  <span>Nuevo Ticket</span>
                </button>
              </li>
              <li className={activeMenu === 'tickets' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveMenu('tickets')}>
                  <FiList className="icon" />
                  <span>Mis Tickets</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="user-main">
          {activeMenu === 'dashboard' && (
            <div className="placeholder">Bienvenido al panel de usuario</div>
          )}
          {activeMenu === 'new' && (
            <TicketForm token={token} onCreated={() => setActiveMenu('tickets')} />
          )}
          {activeMenu === 'tickets' && (
            <TicketList token={token} role={role} />
          )}
        </main>
      </div>
    </div>
  );
}
