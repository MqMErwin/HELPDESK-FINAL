import React, { useState, useEffect, useMemo } from 'react';
import './AdminDashboard.css';
import './TechnicianDashboard.css';
import emiLogo from '../assets/ESCUELA-MILITAR-DE-INGENIERIA.png';
import {
  FiHome,
  FiMessageSquare,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiLogOut,
  FiBell,
  FiMenu,
  FiX,
  FiChevronDown,
  FiSettings,
  FiEye,
  FiSun,
  FiMoon,
  FiMonitor,
  FiGlobe,
  FiShield,
  FiSmartphone,
  FiGrid,
  FiLock,
  FiTrendingUp
} from 'react-icons/fi';
import TicketList from './TicketList.jsx';

export default function TechnicianDashboard({ onLogout, token, role }) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';
  const [notifications] = useState([
    { id: 1, text: 'Nuevo ticket asignado #TKT-00789', time: '10 min ago', read: false },
    { id: 2, text: 'Ticket #TKT-00425 requiere atención', time: '1 hora ago', read: true },
    { id: 3, text: 'Recordatorio: Ticket pendiente de cierre', time: '2 días ago', read: true }
  ]);
  
  const [unreadNotifications] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

  // Estadísticas y tickets reales
  const [ticketStats, setTicketStats] = useState({ assigned: 0, inProgress: 0, resolved: 0 });
  const [recentTickets, setRecentTickets] = useState([]);

  const [preferences, setPreferences] = useState({
    theme: 'auto',
    language: 'es',
    density: 'comfortable',
    fontScale: 100
  });
  const [notificationsConfig, setNotificationsConfig] = useState({
    assignments: true,
    status: true,
    reminders: true
  });
  const [quickActions, setQuickActions] = useState(['dashboard', 'tickets']);
  const [securityOptions, setSecurityOptions] = useState({
    twoFactor: false,
    deviceAlerts: true
  });
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome en Windows', location: 'Cochabamba, BO', lastActive: 'Hace 3 min', current: true, active: true },
    { id: 2, device: 'Android · App móvil', location: 'La Paz, BO', lastActive: 'Hace 1 h', current: false, active: true }
  ]);

  const themeOptions = useMemo(() => ([
    { value: 'auto', label: 'Automático', icon: <FiMonitor /> },
    { value: 'light', label: 'Claro', icon: <FiSun /> },
    { value: 'dark', label: 'Oscuro', icon: <FiMoon /> }
  ]), []);

  const languageOptions = useMemo(() => ([
    { value: 'es', label: 'Español (ES)' },
    { value: 'en', label: 'English (EN)' }
  ]), []);

  const densityOptions = useMemo(() => ([
    { value: 'comfortable', label: 'Cómodo' },
    { value: 'compact', label: 'Compacto' }
  ]), []);

  const notificationsOptions = useMemo(() => ([
    { key: 'assignments', title: 'Tickets asignados', description: 'Avisa cuando recibes un nuevo caso.', icon: <FiBell /> },
    { key: 'status', title: 'Cambios de estado', description: 'Notifica cuando el solicitante actualiza un ticket.', icon: <FiTrendingUp /> },
    { key: 'reminders', title: 'Recordatorios de SLA', description: 'Alertas antes de que venza el compromiso de atención.', icon: <FiClock /> }
  ]), []);

  const quickActionOptions = useMemo(() => ([
    { id: 'dashboard', label: 'Resumen', description: 'Indicadores personales y actividad reciente.', icon: <FiHome /> },
    { id: 'tickets', label: 'Tickets asignados', description: 'Gestiona las incidencias que tienes a cargo.', icon: <FiMessageSquare /> },
  ]), []);

  const activeSessionsDisplay = useMemo(() => activeSessions.filter((session) => session.active), [activeSessions]);

  const handleThemeChange = (value) => setPreferences((prev) => ({ ...prev, theme: value }));
  const handleLanguageChange = (event) => setPreferences((prev) => ({ ...prev, language: event.target.value }));
  const handleFontScaleChange = (event) => setPreferences((prev) => ({ ...prev, fontScale: Number(event.target.value) }));
  const handleDensityChange = (value) => setPreferences((prev) => ({ ...prev, density: value }));
  const handleResetPreferences = () => setPreferences({ theme: 'auto', language: 'es', density: 'comfortable', fontScale: 100 });

  const handleNotificationToggle = (key) => setNotificationsConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  const handleResetNotifications = () => setNotificationsConfig({ assignments: true, status: true, reminders: true });

  const handleQuickActionToggle = (id) => setQuickActions((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  const handleResetQuickActions = () => setQuickActions(['dashboard', 'tickets']);

  const handleSecurityToggle = (key) => setSecurityOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  const handleEndSession = (id) => setActiveSessions((prev) => prev.map((session) => (session.id === id ? { ...session, active: false } : session)));
  const handleEndOtherSessions = () => setActiveSessions((prev) => prev.map((session) => (session.current ? session : { ...session, active: false })));

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

  // Mapea valores de estado del backend a un texto legible
  const mapEstado = (estadoVal) => {
    const map = {
      0: 'Esperando',
      1: 'Asignado',
      2: 'EnProgreso',
      3: 'Resuelto',
      Esperando: 'Esperando',
      Asignado: 'Asignado',
      EnProgreso: 'EnProgreso',
      Resuelto: 'Resuelto'
    };
    return map.hasOwnProperty(estadoVal) ? map[estadoVal] : (estadoVal || '');
  };

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    const uid = getUserIdFromToken(token);
    if (!uid) return;
    // Stats del técnico
    fetch(`${API_URL}/stats/tech/${uid}`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setTicketStats({ assigned: data.assigned, inProgress: data.inProgress, resolved: data.resolved }); })
      .catch(() => {});
    // Tickets asignados (para tabla reciente)
    fetch(`${API_URL}/tickets`, { headers })
      .then(r => r.ok ? r.json() : [])
      .then(list => {
        if (Array.isArray(list)) {
          const mine = list.filter(t => String(t.tecnicoId) === String(uid));
          // Fallback: computar stats locales si el endpoint devolvió 0s o falló
          try {
            const s = {
              assigned: mine.filter(t => t.estado === 'Asignado' || t.estado === 1).length,
              inProgress: mine.filter(t => t.estado === 'EnProgreso' || t.estado === 2).length,
              resolved: mine.filter(t => t.estado === 'Resuelto' || t.estado === 3).length
            };
            if ((s.assigned + s.inProgress + s.resolved) > 0) setTicketStats(prev => ({ ...prev, ...s }));
          } catch {}

          const recent = mine
            .sort((a,b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0))
            .slice(0, 5);
          setRecentTickets(recent);
        }
      })
      .catch(() => {});
  }, [token]);

  return (
    <div className={`admin-dashboard technician-theme ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Header superior */}
      <header className="admin-header technician-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <h1 className="app-logo">
            <span className="logo-part">HelpDesk</span>
            <img src={emiLogo} alt="Logo EMI" className="emi-logo" />
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
            <div className="avatar">T</div>
            <div className="user-info">
              <span className="user-name">Técnico</span>
              <span className="user-role">Soporte TI</span>
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
      <div className="admin-content technician-content">
        {/* Sidebar */}
        <aside className="admin-sidebar technician-sidebar">
          <nav>
            <ul>
              <li className={activeMenu === 'dashboard' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveMenu('dashboard')}>
                  <FiHome className="icon" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li className={activeMenu === 'tickets' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveMenu('tickets')}>
                  <FiMessageSquare className="icon" />
                  <span>Mis Tickets</span>
                </button>
              </li>
              <li className={activeMenu === 'settings' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveMenu('settings')}>
                  <FiSettings className="icon" />
                  <span>Configuración</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Área principal */}
        <main className="admin-main technician-main">
          {activeMenu === 'dashboard' && (
            <>
              <div className="welcome-section">
                <h2>Bienvenido, <span>Técnico</span></h2>
                <p className="last-access">Último acceso: Hoy a las {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>

              {/* Estadísticas rápidas */}
              <div className="stats-grid technician-stats">
                <div className="stat-card">
                  <div className="stat-icon assigned-stat">
                    <FiMessageSquare />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{ticketStats.assigned}</span>
                    <span className="stat-label">Asignados</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon progress-stat">
                    <FiClock />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{ticketStats.inProgress}</span>
                    <span className="stat-label">En progreso</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon resolved-stat">
                    <FiCheckCircle />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{ticketStats.resolved}</span>
                    <span className="stat-label">Resueltos</span>
                  </div>
                </div>

              </div>

              {/* Tarjetas de acción */}
              <div className="section-title">
                <h3>Acciones rápidas</h3>
                <button type="button" className="view-all">Ver todo</button>
              </div>

              <div className="card-container">
                <div className="admin-card technician-card tickets-card">
                  <div className="card-icon">
                    <FiMessageSquare />
                  </div>
                  <h3>Ver Tickets Asignados</h3>
                  <p>Revisa los tickets que te han sido asignados para atención.</p>
                  <button className="card-button" onClick={() => setActiveMenu('tickets')}>Ver Tickets</button>
                </div>

                <div className="admin-card technician-card update-card">
                  <div className="card-icon">
                    <FiCheckCircle />
                  </div>
                  <h3>Actualizar Estados</h3>
                  <p>Marca los tickets como en progreso o resueltos.</p>
                  <button className="card-button" onClick={() => setActiveMenu('tickets')}>Actualizar</button>
                </div>

              </div>

              {/* Tickets recientes */}
              <div className="section-title">
                <h3>Tickets Recientes</h3>
                <button type="button" className="view-all">Ver todos</button>
              </div>

              <div className="tickets-table">
                <div className="table-header">
                  <div className="header-item">ID Ticket</div>
                  <div className="header-item">Descripción</div>
                  <div className="header-item">Estado</div>
                  <div className="header-item">Prioridad</div>
                  <div className="header-item">Tiempo</div>
                  <div className="header-item">Acciones</div>
                </div>

                {recentTickets.map(ticket => (
                  <div className="table-row" key={ticket.id}>
                    <div className="row-item">{ticket.id}</div>
                    <div className="row-item">{ticket.titulo || ticket.descripcion}</div>
                    <div className="row-item">
                      {(() => {
                        const text = mapEstado(ticket.estado);
                        const cls = String(text).toLowerCase().replace(' ', '-');
                        return (
                          <span className={`status-badge ${cls}`}>
                            {text === 'EnProgreso' ? 'En progreso' : text}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="row-item">
                      <span className={`priority-badge baja`}>-</span>
                    </div>
                    <div className="row-item">{ticket.fechaCreacion ? new Date(ticket.fechaCreacion).toLocaleString() : '-'}</div>
                    <div className="row-item row-actions">
                      <button
                        type="button"
                        className="table-icon-btn view"
                        title={`Ver ticket ${ticket.id}`}
                        aria-label={`Ver ticket ${ticket.id}`}
                      >
                        <FiEye aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {activeMenu === 'tickets' && (
            <TicketList token={token} role={role} />
          )}
          {activeMenu === 'settings' && (
            <div className="settings-layout">
              <section className="settings-section">
                <div className="settings-section__header">
                  <div>
                    <h3>Ajustes personales</h3>
                    <p>Adapta tu consola de técnico para trabajar con comodidad.</p>
                  </div>
                  <button type="button" className="settings-reset-btn" onClick={handleResetPreferences}>Restablecer</button>
                </div>
                <div className="settings-grid">
                  <div className="settings-card">
                    <div className="settings-card__header">
                      <span className="settings-card__icon"><FiSun /></span>
                      <div>
                        <h4>Modo de color</h4>
                        <p>Controla el contraste del panel según el entorno.</p>
                      </div>
                    </div>
                    <div className="settings-pills">
                      {themeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`settings-pill${preferences.theme === option.value ? ' active' : ''}`}
                          onClick={() => handleThemeChange(option.value)}
                        >
                          <span className="settings-pill__icon">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="settings-card">
                    <div className="settings-card__header">
                      <span className="settings-card__icon"><FiGlobe /></span>
                      <div>
                        <h4>Idioma y texto</h4>
                        <p>Define el idioma y el tamaño de letra que prefieres.</p>
                      </div>
                    </div>
                    <div className="settings-select-group">
                      <label className="settings-label">Idioma</label>
                      <select className="settings-select" value={preferences.language} onChange={handleLanguageChange}>
                        {languageOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="settings-range">
                      <div className="settings-range__label">
                        <span>Tamaño de fuente</span>
                        <span>{preferences.fontScale}%</span>
                      </div>
                      <input
                        type="range"
                        min="90"
                        max="120"
                        step="5"
                        value={preferences.fontScale}
                        onChange={handleFontScaleChange}
                      />
                    </div>
                    <div className="settings-pills density">
                      {densityOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`settings-pill${preferences.density === option.value ? ' active' : ''}`}
                          onClick={() => handleDensityChange(option.value)}
                        >
                          <span className="settings-pill__icon"><FiGrid /></span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="settings-section">
                <div className="settings-section__header">
                  <div>
                    <h3>Notificaciones</h3>
                    <p>Recibe avisos en el momento justo.</p>
                  </div>
                  <button type="button" className="settings-reset-btn" onClick={handleResetNotifications}>Restablecer</button>
                </div>
                <div className="settings-card wide">
                  <div className="settings-card__header">
                    <span className="settings-card__icon"><FiBell /></span>
                    <div>
                      <h4>Alertas de trabajo</h4>
                      <p>Activa únicamente los avisos que necesitas.</p>
                    </div>
                  </div>
                  <div className="settings-stack">
                    {notificationsOptions.map((item) => (
                      <label key={item.key} className="settings-toggle">
                        <input type="checkbox" checked={notificationsConfig[item.key]} onChange={() => handleNotificationToggle(item.key)} />
                        <span className="settings-toggle__control" />
                        <div className="settings-toggle__details">
                          <span className="settings-toggle__icon">{item.icon}</span>
                          <div>
                            <strong>{item.title}</strong>
                            <span>{item.description}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              <section className="settings-section">
                <div className="settings-section__header">
                  <div>
                    <h3>Accesos rápidos</h3>
                    <p>Elige los accesos que aparecerán en el menú lateral.</p>
                  </div>
                  <button type="button" className="settings-reset-btn" onClick={handleResetQuickActions}>Restablecer</button>
                </div>
                <div className="settings-card wide">
                  <div className="settings-card__header">
                    <span className="settings-card__icon"><FiSettings /></span>
                    <div>
                      <h4>Menú del técnico</h4>
                      <p>Accede más rápido a las pantallas que usas a diario.</p>
                    </div>
                  </div>
                  <div className="settings-stack">
                    {quickActionOptions.map((option) => (
                      <label key={option.id} className="settings-checkbox">
                        <input type="checkbox" checked={quickActions.includes(option.id)} onChange={() => handleQuickActionToggle(option.id)} />
                        <span className="settings-checkbox__control" />
                        <div className="settings-checkbox__body">
                          <span className="settings-checkbox__icon">{option.icon}</span>
                          <div>
                            <strong>{option.label}</strong>
                            <span>{option.description}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              <section className="settings-section">
                <div className="settings-section__header">
                  <div>
                    <h3>Seguridad</h3>
                    <p>Protege tus accesos y gestiona las sesiones abiertas.</p>
                  </div>
                </div>
                <div className="settings-grid">
                  <div className="settings-card">
                    <div className="settings-card__header">
                      <span className="settings-card__icon"><FiShield /></span>
                      <div>
                        <h4>Verificaciones</h4>
                        <p>Activa medidas adicionales para tus inicios de sesión.</p>
                      </div>
                    </div>
                    <div className="settings-stack">
                      <label className="settings-toggle">
                        <input type="checkbox" checked={securityOptions.twoFactor} onChange={() => handleSecurityToggle('twoFactor')} />
                        <span className="settings-toggle__control" />
                        <div className="settings-toggle__details">
                          <span className="settings-toggle__icon"><FiLock /></span>
                          <div>
                            <strong>Verificación en dos pasos</strong>
                            <span>Solicitar un código adicional al ingresar.</span>
                          </div>
                        </div>
                      </label>
                      <label className="settings-toggle">
                        <input type="checkbox" checked={securityOptions.deviceAlerts} onChange={() => handleSecurityToggle('deviceAlerts')} />
                        <span className="settings-toggle__control" />
                        <div className="settings-toggle__details">
                          <span className="settings-toggle__icon"><FiBell /></span>
                          <div>
                            <strong>Alertas de nuevos dispositivos</strong>
                            <span>Recibe un mensaje cuando un dispositivo desconocido acceda.</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="settings-card">
                    <div className="settings-card__header">
                      <span className="settings-card__icon"><FiSmartphone /></span>
                      <div>
                        <h4>Sesiones activas</h4>
                        <p>Finaliza sesiones que ya no utilices.</p>
                      </div>
                    </div>
                    <ul className="settings-session-list">
                      {activeSessionsDisplay.length === 0 ? (
                        <li className="settings-session empty">No hay otras sesiones activas.</li>
                      ) : (
                        activeSessionsDisplay.map((session) => (
                          <li key={session.id} className={`settings-session${session.current ? ' current' : ''}`}>
                            <div>
                              <span className="settings-session__device">{session.device}</span>
                              <span className="settings-session__meta">{session.location} · {session.lastActive}</span>
                            </div>
                            {!session.current && (
                              <button type="button" className="settings-link" onClick={() => handleEndSession(session.id)}>Cerrar</button>
                            )}
                          </li>
                        ))
                      )}
                    </ul>
                    {activeSessionsDisplay.some((session) => !session.current) && (
                      <button type="button" className="settings-link" onClick={handleEndOtherSessions}>
                        Cerrar todas las demás sesiones
                      </button>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


