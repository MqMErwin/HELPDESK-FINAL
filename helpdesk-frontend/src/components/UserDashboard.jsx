import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import './UserDashboard.css';
import TicketForm from './TicketForm';
import TicketList from './TicketList.jsx';
import {
  FiHome,
  FiPlus,
  FiList,
  FiLogOut,
  FiBell,
  FiMenu,
  FiX,
  FiChevronDown,
  FiMessageSquare,
  FiCheckCircle
} from 'react-icons/fi';

export default function UserDashboard({ onLogout, token, role }) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';
  const [userStats, setUserStats] = useState({ activos: 0, resueltos: 0, total: 0 });
  const [myRecent, setMyRecent] = useState([]);
  const [pendingRatings, setPendingRatings] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('new');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Ticket actualizado', time: '1h', read: false }
  ];
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const mapEstado = (val) => {
    const map = { 0:'Esperando',1:'Asignado',2:'EnProgreso',3:'Resuelto', Esperando:'Esperando', Asignado:'Asignado', EnProgreso:'EnProgreso', Resuelto:'Resuelto' };
    return Object.prototype.hasOwnProperty.call(map, val) ? map[val] : (val || '');
  };

  const getUserIdFromToken = (tk) => {
    if (!tk) return null;
    try {
      const payload = JSON.parse(atob(tk.split('.')[1]));
      return (
        payload['nameid'] ||
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        payload['sub'] || null
      );
    } catch { return null; }
  };

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    const uid = getUserIdFromToken(token);
    if (!uid) return;
    fetch(`${API_URL}/stats/user/${uid}`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setUserStats(data); })
      .catch(() => {});
    fetch(`${API_URL}/tickets`, { headers })
      .then(r => r.ok ? r.json() : [])
      .then(list => {
        const mine = Array.isArray(list) ? list.filter(t => String(t.usuarioId) === String(uid)) : [];
        const recent = mine.sort((a,b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0)).slice(0,5);
        setMyRecent(recent);
      })
      .catch(() => {});

    // Tickets resueltos sin calificar
    fetch(`${API_URL}/stats/user/pending-ratings/${uid}`, { headers })
      .then(r => r.ok ? r.json() : [])
      .then(list => setPendingRatings(Array.isArray(list) ? list : []))
      .catch(() => {});
  }, [token]);

  return (
    <div className={`admin-dashboard user-theme ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <header className="admin-header user-header">
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

      <div className="admin-content user-content">
        <aside className="admin-sidebar user-sidebar">
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

        <main className="admin-main user-main">
          {activeMenu === 'dashboard' && (
            <>
              {/* Alerta de calificación pendiente */}
              {pendingRatings.length > 0 && (
                <div className="alert alert-info" style={{marginBottom:'16px'}}>
                  Tienes {pendingRatings.length} ticket(s) resueltos pendientes de calificar.
                  <button className="alert-action" onClick={() => setActiveMenu('tickets')}>Calificar ahora</button>
                </div>
              )}

              <div className="welcome-section">
                <h2>Bienvenido, <span>Usuario</span></h2>
                <p className="last-access">Último acceso: Hoy a las {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
              <div className="stats-grid user-stats">
                <div className="stat-card">
                  <div className="stat-icon open-stat"><FiMessageSquare /></div>
                  <div className="stat-info">
                    <span className="stat-value">{userStats.total}</span>
                    <span className="stat-label">Total</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon progress-stat"><FiMessageSquare /></div>
                  <div className="stat-info">
                    <span className="stat-value">{userStats.activos}</span>
                    <span className="stat-label">Activos</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon resolved-stat"><FiCheckCircle /></div>
                  <div className="stat-info">
                    <span className="stat-value">{userStats.resueltos}</span>
                    <span className="stat-label">Resueltos</span>
                  </div>
                </div>
              </div>
              <div className="recent-activity">
                {myRecent.length === 0 ? (
                  <p>Sin actividad reciente</p>
                ) : (
                  myRecent.map(t => (
                    <div className="activity-item" key={t.id}>
                      <div className="activity-content">
                        <p>Ticket #{t.id}: {t.titulo || t.descripcion} ({mapEstado(t.estado)})</p>
                        <span className="activity-time">{t.fechaCreacion ? new Date(t.fechaCreacion).toLocaleString() : '-'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
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
