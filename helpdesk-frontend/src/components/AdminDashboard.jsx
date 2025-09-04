import React, { useState } from 'react';
import './AdminDashboard.css';
import {
  FiSettings,
  FiUsers,
  FiPieChart,
  FiMessageSquare,
  FiPlusCircle,
  FiLogOut,
  FiBell,
  FiHome,
  FiChevronDown,
  FiMenu,
  FiX
} from 'react-icons/fi';
import TicketTable from './TicketTable';
import TicketForm from './TicketForm';
import UserManagement from './UserManagement';

export default function AdminDashboard({ onLogout, token, role }) {
  const [notifications] = useState([
    { id: 1, text: 'Nuevo ticket asignado', time: '10 min ago', read: false },
    { id: 2, text: 'Actualización del sistema disponible', time: '1 hora ago', read: true },
    { id: 3, text: 'Reporte mensual generado', time: '2 días ago', read: true }
  ]);
  
  const [unreadNotifications] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className={`admin-dashboard ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Header superior */}
      <header className="admin-header">
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
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? '' : 'unread'}`}
                    >
                      <div className="notification-dot"></div>
                      <div className="notification-content">
                        <p>{notification.text}</p>
                        <span className="notification-time">{notification.time}</span>
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
            <div className="avatar">AD</div>
            <div className="user-info">
              <span className="user-name">Admin</span>
              <span className="user-role">Administrador</span>
            </div>
            <FiChevronDown className="dropdown-icon" />
          </div>
          
          <button className="logout-button" onClick={onLogout}>
            <FiLogOut />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="admin-content">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav>
            <ul>
              <li className={activeMenu === 'dashboard' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveMenu('dashboard')}>
                  <FiHome className="icon" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li className={activeMenu === 'settings' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveMenu('settings')}>
                  <FiSettings className="icon" />
                  <span>Configuración</span>
                </button>
              </li>
              <li className={activeMenu === 'reports' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveMenu('reports')}>
                  <FiPieChart className="icon" />
                  <span>Reportes</span>
                </button>
              </li>
              <li className={activeMenu === 'ticket-list' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveMenu('ticket-list')}>
                  <FiMessageSquare className="icon" />
                  <span>Lista de Tickets</span>
                </button>
              </li>
              <li className={activeMenu === 'ticket-create' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveMenu('ticket-create')}>
                  <FiPlusCircle className="icon" />
                  <span>Crear Tickets</span>
                </button>
              </li>
              <li className={activeMenu === 'users' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveMenu('users')}>
                  <FiUsers className="icon" />
                  <span>Usuarios</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Área principal */}
        <main className="admin-main">
          {activeMenu === 'dashboard' && (
            <>
              <div className="welcome-section">
                <h2>Bienvenido, <span>Administrador</span></h2>
                <p className="last-access">Último acceso: Hoy a las {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>

              {/* Estadísticas rápidas */}
              <div className="quick-stats">
                <div className="stat-card">
                  <div className="stat-icon users-stat">
                    <FiUsers />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">1,245</span>
                    <span className="stat-label">Usuarios</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon tickets-stat">
                    <FiMessageSquare />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">42</span>
                    <span className="stat-label">Tickets activos</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon solved-stat">
                    <FiMessageSquare />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">128</span>
                    <span className="stat-label">Resueltos</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon satisfaction-stat">
                    <FiPieChart />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">92%</span>
                    <span className="stat-label">Satisfacción</span>
                  </div>
                </div>
              </div>

              {/* Tarjetas de acción */}
              <div className="section-title">
                <h3>Acciones rápidas</h3>
                <button type="button" className="view-all">Ver todo</button>
              </div>

              <div className="card-container">
                <div className="admin-card config-card">
                  <div className="card-icon">
                    <FiSettings />
                  </div>
                  <h3>Configurar Sistema</h3>
                  <p>Administrar roles y categorías del sistema.</p>
                  <button className="card-button" onClick={() => setActiveMenu('settings')}>Ir a Configuración</button>
                </div>

                <div className="admin-card reports-card">
                  <div className="card-icon">
                    <FiPieChart />
                  </div>
                  <h3>Ver Reportes</h3>
                  <p>Visualizar estadísticas de tickets y rendimiento.</p>
                  <button className="card-button" onClick={() => setActiveMenu('reports')}>Ver Reportes</button>
                </div>

                <div className="admin-card tickets-card">
                  <div className="card-icon">
                    <FiMessageSquare />
                  </div>
                  <h3>Ver Tickets</h3>
                  <p>Revisar todas las solicitudes registradas.</p>
                  <button className="card-button" onClick={() => setActiveMenu('ticket-list')}>Ver Tickets</button>
                </div>

                <div className="admin-card users-card">
                  <div className="card-icon">
                    <FiUsers />
                  </div>
                  <h3>Gestionar Usuarios</h3>
                  <p>Agregar, editar y eliminar cuentas de usuarios.</p>
                  <button className="card-button" onClick={() => setActiveMenu('users')}>Gestionar Usuarios</button>
                </div>
              </div>

              {/* Actividad reciente */}
              <div className="section-title">
                <h3>Actividad reciente</h3>
                <button type="button" className="view-all">Ver todo</button>
              </div>

              <div className="recent-activity">
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p>Nuevo usuario registrado: <strong>María González</strong></p>
                    <span className="activity-time">Hace 15 minutos</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p>Ticket <strong>#TKT-00425</strong> asignado a técnico</p>
                    <span className="activity-time">Hace 32 minutos</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p>Reporte mensual generado automáticamente</p>
                    <span className="activity-time">Hace 2 horas</span>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeMenu === 'ticket-list' && (
            <TicketTable token={token} />
          )}
          {activeMenu === 'ticket-create' && (
            <div>
              <h3>Crear Tickets</h3>
              <TicketForm token={token} />
            </div>
          )}
          {activeMenu === 'users' && (<UserManagement token={token} />)}
          {activeMenu === 'settings' && (
            <div className="placeholder">Configuración del sistema en construcción</div>
          )}
          {activeMenu === 'reports' && (
            <div className="placeholder">Reportes del sistema en construcción</div>
          )}
        </main>
      </div>
    </div>
  );
}
