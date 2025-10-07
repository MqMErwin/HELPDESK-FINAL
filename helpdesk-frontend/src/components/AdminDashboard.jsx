import React, { useState, useEffect, useMemo, useRef } from 'react';

import './AdminDashboard.css';
import emiLogo from '../assets/ESCUELA-MILITAR-DE-INGENIERIA.png';

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

  FiX,

  FiTrendingUp,

  FiClock,

  FiSun,

  FiMoon,

  FiMonitor,

  FiGlobe,

  FiShield,

  FiSmartphone,

  FiGrid,

  FiLock

} from 'react-icons/fi';

import TicketList from './TicketList.jsx';

import TicketForm from './TicketForm';

import HelpSection from './HelpSection';

import UserManagement from './UserManagement';



export default function AdminDashboard({ onLogout, token, role }) {

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';

  const [adminStats, setAdminStats] = useState(null);

  const [recent, setRecent] = useState([]);

  const [notifications] = useState([

    { id: 1, text: 'Nuevo ticket asignado', time: '10 min ago', read: false },

    { id: 2, text: 'Actualizacion del sistema disponible', time: '1 hora ago', read: true },

    { id: 3, text: 'Reporte mensual generado', time: '2 dias ago', read: true }

  ]);



  const [unreadNotifications] = useState(1);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [activeMenu, setActiveMenu] = useState('dashboard');

  const [showNotifications, setShowNotifications] = useState(false);



  const [preferences, setPreferences] = useState({

    theme: 'auto',

    language: 'es',

    density: 'comfortable',

    fontScale: 100

  });

  const [notificationsConfig, setNotificationsConfig] = useState({

    assigned: true,

    reminders: true,

    updates: false,

    digest: true

  });

  const [shortcuts, setShortcuts] = useState(['dashboard', 'ticket-list', 'users', 'reports']);

  const [securityOptions, setSecurityOptions] = useState({

    twoFactor: false,

    loginAlerts: true

  });

  const [activeSessions, setActiveSessions] = useState([

    { id: 1, device: 'Chrome en Windows', location: 'Cochabamba, BO', lastActive: 'Hace 5 min', current: true, active: true },

    { id: 2, device: 'Safari en iPhone', location: 'La Paz, BO', lastActive: 'Hace 2 h', current: false, active: true },

    { id: 3, device: 'Edge en Laptop', location: 'Santa Cruz, BO', lastActive: 'Hace 1 d�a', current: false, active: true }

  ]);



  const themeOptions = useMemo(() => ([

    { value: 'auto', label: 'Autom�tico', icon: <FiMonitor /> },

    { value: 'light', label: 'Claro', icon: <FiSun /> },

    { value: 'dark', label: 'Oscuro', icon: <FiMoon /> }

  ]), []);



  const languageOptions = useMemo(() => ([

    { value: 'es', label: 'Espa�ol (ES)' },

    { value: 'en', label: 'English (EN)' }

  ]), []);



  const densityOptions = useMemo(() => ([

    { value: 'comfortable', label: 'C�modo' },

    { value: 'compact', label: 'Compacto' }

  ]), []);



  const quickActionOptions = useMemo(() => ([

    { id: 'dashboard', label: 'Panel principal', description: 'Resumen ejecutivo y actividad reciente.', icon: <FiHome /> },

    { id: 'ticket-list', label: 'Gesti�n de tickets', description: 'Control completo de solicitudes y SLA.', icon: <FiMessageSquare /> },

    { id: 'users', label: 'Usuarios', description: 'Altas, permisos y roles.', icon: <FiUsers /> },

    { id: 'reports', label: 'Reportes', description: 'Indicadores e informes descargables.', icon: <FiPieChart /> }

  ]), []);



  const notificationsOptions = useMemo(() => ([

    { key: 'assigned', title: 'Asignaciones de tickets', description: 'Recibe un aviso al asignar o reabrir tickets.', icon: <FiBell /> },

    { key: 'reminders', title: 'Recordatorios diarios', description: 'Resumen automatizado cada ma�ana con los pendientes cr�ticos.', icon: <FiClock /> },

    { key: 'updates', title: 'Novedades de la plataforma', description: 'Avisos sobre cambios y nuevas funciones del sistema.', icon: <FiTrendingUp /> },

    { key: 'digest', title: 'Resumen semanal', description: 'Informe consolidado todos los lunes con m�tricas clave.', icon: <FiPieChart /> }

  ]), []);



  const activeSessionsDisplay = useMemo(() => activeSessions.filter((session) => session.active), [activeSessions]);



  const handleThemeChange = (value) => setPreferences((prev) => ({ ...prev, theme: value }));

  const handleLanguageChange = (event) => setPreferences((prev) => ({ ...prev, language: event.target.value }));

  const handleFontScaleChange = (event) => setPreferences((prev) => ({ ...prev, fontScale: Number(event.target.value) }));

  const handleDensityChange = (value) => setPreferences((prev) => ({ ...prev, density: value }));

  const handleResetPreferences = () => setPreferences({ theme: 'auto', language: 'es', density: 'comfortable', fontScale: 100 });



  const handleNotificationToggle = (key) => setNotificationsConfig((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleResetNotifications = () => setNotificationsConfig({ assigned: true, reminders: true, updates: false, digest: true });



  const handleShortcutToggle = (id) => setShortcuts((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const handleResetShortcuts = () => setShortcuts(quickActionOptions.map((option) => option.id));



  const handleSecurityToggle = (key) => setSecurityOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleEndSession = (id) => setActiveSessions((prev) => prev.map((session) => (session.id === id ? { ...session, active: false } : session)));

  const handleEndOtherSessions = () => setActiveSessions((prev) => prev.map((session) => (session.current ? session : { ...session, active: false })));



  useEffect(() => {

    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API_URL}/stats/admin`, { headers })

      .then((r) => (r.ok ? r.json() : null))

      .then((data) => setAdminStats(data || null))

      .catch(() => {});

    fetch(`${API_URL}/stats/recent`, { headers })

      .then((r) => (r.ok ? r.json() : []))

      .then((list) => setRecent(Array.isArray(list) ? list : []))

      .catch(() => {});

  }, [token]);



  return (

    <div className={`admin-dashboard ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>

      {/* Header superior */}

      <header className="admin-header">

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

                  <span className="mark-read">Marcar todas como le�das</span>

                </div>

                <div className="notification-list">

                  {notifications.map((notification) => (

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

            <span>Cerrar sesion</span>

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

                  <span>Configuracion</span>

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

              <li className={activeMenu === 'help' ? 'active' : ''}>

                <button type="button" onClick={() => setActiveMenu('help')}>

                  <FiMessageSquare className="icon" />

                  <span>Ayuda</span>

                </button>

              </li>

            </ul>

          </nav>

        </aside>



        {/* Contenido */}

        <main className="admin-main">

          {activeMenu === 'dashboard' && (

            <>

              {/* Tarjetas de estad?stica */}

              <div className="stats-grid">

                <div className="stat-card">

                  <div className="stat-icon">

                    <FiUsers />

                  </div>

                  <div className="stat-info">

                    <span className="stat-value">{adminStats ? adminStats.usuarios : 0}</span>

                    <span className="stat-label">Usuarios registrados</span>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon info-stat">

                    <FiMessageSquare />

                  </div>

                  <div className="stat-info">

                    <span className="stat-value">{adminStats ? adminStats.ticketsTotal : 0}</span>

                    <span className="stat-label">Tickets totales</span>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon secondary-stat">

                    <FiTrendingUp />

                  </div>

                  <div className="stat-info">

                    <span className="stat-value">{adminStats ? adminStats.ticketsActivos : 0}</span>

                    <span className="stat-label">Tickets activos</span>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon satisfaction-stat">

                    <FiPieChart />

                  </div>

                  <div className="stat-info">

                    <span className="stat-value">{adminStats ? `${adminStats.satisfaccion}%` : '0%'}</span>

                    <span className="stat-label">Satisfaccion</span>

                  </div>

                </div>

              </div>



              {/* Tarjetas de acci?n */}

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

                  <p>Administrar roles y categorias del sistema.</p>

                  <button className="card-button" onClick={() => setActiveMenu('settings')}>Ir a Configuracion</button>

                </div>



                <div className="admin-card reports-card">

                  <div className="card-icon">

                    <FiPieChart />

                  </div>

                  <h3>Ver Reportes</h3>

                  <p>Visualizar estadisticas de tickets y rendimiento.</p>

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

                {recent.length === 0 ? (

                  <div className="activity-item">

                    <div className="activity-content"><p>Sin actividad reciente</p></div>

                  </div>

                ) : (

                  recent.map((a, idx) => (

                    <div key={idx} className="activity-item">

                      <div className="activity-dot"></div>

                      <div className="activity-content">

                        <p>{a.message}</p>

                        <span className="activity-time">{new Date(a.when).toLocaleString()}</span>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </>

          )}

          {activeMenu === 'ticket-list' && (

            <TicketList token={token} role={'Administrador'} />

          )}

          {activeMenu === 'ticket-create' && (

            <div>

              <h3>Crear Tickets</h3>

              <TicketForm token={token} />

            </div>

          )}

          {activeMenu === 'users' && <UserManagement token={token} />}

          {activeMenu === 'help' && <HelpSection role={role} />}


          {activeMenu === 'settings' && (

            <div className="settings-layout">

              <section className="settings-section">

                <div className="settings-section__header">

                  <div>

                    <h3>Preferencias de interfaz</h3>

                    <p>Personaliza la apariencia general para los administradores.</p>

                  </div>

                  <button type="button" className="settings-reset-btn" onClick={handleResetPreferences}>Restablecer</button>

                </div>

                <div className="settings-grid">

                  <div className="settings-card">

                    <div className="settings-card__header">

                      <span className="settings-card__icon"><FiSun /></span>

                      <div>

                        <h4>Modo de color</h4>

                        <p>Elige c�mo se adapta el panel a tu entorno.</p>

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

                        <p>Configura el idioma y la escala tipogr�fica.</p>

                      </div>

                    </div>

                    <div className="settings-select-group">

                      <label className="settings-label">Idioma principal</label>

                      <select className="settings-select" value={preferences.language} onChange={handleLanguageChange}>

                        {languageOptions.map((option) => (

                          <option key={option.value} value={option.value}>{option.label}</option>

                        ))}

                      </select>

                    </div>

                    <div className="settings-range">

                      <div className="settings-range__label">

                        <span>Tama�o de fuente</span>

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

                    <p>Controla los avisos autom�ticos que recibir�s.</p>

                  </div>

                  <button type="button" className="settings-reset-btn" onClick={handleResetNotifications}>Restablecer</button>

                </div>

                <div className="settings-card wide">

                  <div className="settings-card__header">

                    <span className="settings-card__icon"><FiBell /></span>

                    <div>

                      <h4>Alertas y recordatorios</h4>

                      <p>Activa los avisos necesarios para tu operaci�n diaria.</p>

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

                    <h3>Accesos r�pidos</h3>

                    <p>Define los m�dulos que aparecer�n en tu barra lateral.</p>

                  </div>

                  <button type="button" className="settings-reset-btn" onClick={handleResetShortcuts}>Restablecer</button>

                </div>

                <div className="settings-card wide">

                  <div className="settings-card__header">

                    <span className="settings-card__icon"><FiSettings /></span>

                    <div>

                      <h4>Men� personalizado</h4>

                      <p>Selecciona las vistas que quieres tener a un clic.</p>

                    </div>

                  </div>

                  <div className="settings-stack">

                    {quickActionOptions.map((option) => (

                      <label key={option.id} className="settings-checkbox">

                        <input type="checkbox" checked={shortcuts.includes(option.id)} onChange={() => handleShortcutToggle(option.id)} />

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

                    <p>Gestiona el acceso y protege las cuentas administrativas.</p>

                  </div>

                </div>

                <div className="settings-grid">

                  <div className="settings-card">

                    <div className="settings-card__header">

                      <span className="settings-card__icon"><FiShield /></span>

                      <div>

                        <h4>Controles de acceso</h4>

                        <p>Activa verificaciones adicionales.</p>

                      </div>

                    </div>

                    <div className="settings-stack">

                      <label className="settings-toggle">

                        <input type="checkbox" checked={securityOptions.twoFactor} onChange={() => handleSecurityToggle('twoFactor')} />

                        <span className="settings-toggle__control" />

                        <div className="settings-toggle__details">

                          <span className="settings-toggle__icon"><FiLock /></span>

                          <div>

                            <strong>Verificaci�n en dos pasos</strong>

                            <span>Solicitar un c�digo adicional al ingresar.</span>

                          </div>

                        </div>

                      </label>

                      <label className="settings-toggle">

                        <input type="checkbox" checked={securityOptions.loginAlerts} onChange={() => handleSecurityToggle('loginAlerts')} />

                        <span className="settings-toggle__control" />

                        <div className="settings-toggle__details">

                          <span className="settings-toggle__icon"><FiBell /></span>

                          <div>

                            <strong>Alertas de inicio de sesi�n</strong>

                            <span>Recibe un correo cuando alguien acceda a tu cuenta.</span>

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

                        <p>Controla desde d�nde est� abierta tu cuenta.</p>

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

                              <span className="settings-session__meta">{session.location} � {session.lastActive}</span>

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

                        Cerrar todas las dem�s sesiones

                      </button>

                    )}

                  </div>

                </div>

              </section>

            </div>

          )}

          {activeMenu === 'reports' && (

            <ReportsPanel token={token} apiUrl={API_URL} adminStats={adminStats} />

          )}

        </main>

      </div>

    </div>

  );

}



function ReportsPanel({ token, apiUrl, adminStats }) {

  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');



  const exportRef = useRef(null);

  const handleExportPDF = () => {
    const node = exportRef.current;
    if (!node) {
      return;
    }

    const content = node.innerHTML;
    const popup = window.open('', '_blank');
    if (!popup) {
      return;
    }

    const styles = `
      body { font-family: Arial, sans-serif; padding: 16px; color: #1c2a4d; }
      h2 { margin-top: 0; }
      .report-summary { display: grid; grid-template-columns: repeat(2, minmax(240px, 1fr)); gap: 12px; }
      .report-card { border: 1px solid #e5eefc; border-radius: 10px; padding: 12px; }
      .reports-grid { display: grid; grid-template-columns: repeat(2, minmax(260px, 1fr)); gap: 12px; margin-top: 12px; }
      .report-panel { border: 1px solid #e5eefc; border-radius: 10px; padding: 12px; }
      .reports-table { width: 100%; border-collapse: collapse; }
      .reports-table th, .reports-table td { border: 1px solid #e5eefc; padding: 6px 8px; font-size: 12px; }
      @media print { .no-print { display: none !important; } }
    `;

    popup.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reporte HelpDesk</title>
          <style>${styles}</style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  const loadTickets = () => {

    const headers = { Authorization: `Bearer ${token}` };

    setLoading(true);

    setError('');

    fetch(`${apiUrl}/tickets`, { headers })

      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('No se pudieron cargar los tickets'))))

      .then((data) => setTickets(Array.isArray(data) ? data : []))

      .catch((err) => setError(err.message || 'Error inesperado'))

      .finally(() => setLoading(false));

  };



  useEffect(() => {

    loadTickets();

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [token, apiUrl]);



  const metrics = useMemo(() => {

    const statusKeys = ['Esperando', 'Asignado', 'EnProgreso', 'Resuelto'];

    const statusCounts = statusKeys.reduce((acc, key) => {

      acc[key] = 0;

      return acc;

    }, {});



    let totalResolutionHours = 0;

    let resolvedCount = 0;

    let totalCalificaciones = 0;

    let calificados = 0;



    tickets.forEach((ticket) => {

      const estado = typeof ticket.estado === 'string' ? ticket.estado : statusKeys[ticket.estado] || 'Esperando';

      if (statusCounts[estado] != null) {

        statusCounts[estado] += 1;

      }



      if (ticket.fechaCreacion && ticket.fechaCierre) {

        const created = new Date(ticket.fechaCreacion);

        const closed = new Date(ticket.fechaCierre);

        const hours = Math.max(0, (closed - created) / 36e5);

        totalResolutionHours += hours;

        resolvedCount += 1;

      }



      if (ticket.calificacion != null) {

        totalCalificaciones += Number(ticket.calificacion);

        calificados += 1;

      }

    });



    const averageResolution = resolvedCount > 0 ? totalResolutionHours / resolvedCount : 0;

    const averageSatisfaction = calificados > 0

      ? totalCalificaciones / calificados

      : (adminStats?.satisfaccion || 0) / 20;



    const last7Days = Array.from({ length: 7 }).map((_, idx) => {

      const date = new Date();

      date.setDate(date.getDate() - (6 - idx));

      const key = date.toISOString().slice(0, 10);

      const count = tickets.filter((ticket) => (ticket.fechaCreacion || '').slice(0, 10) === key).length;

      return {

        key,

        label: date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }),

        count

      };

    });



    const maxDaily = Math.max(...last7Days.map((d) => d.count), 1);



    return {

      statusCounts,

      averageResolution,

      averageSatisfaction: Number(averageSatisfaction.toFixed(2)),

      last7Days,

      maxDaily

    };

  }, [tickets, adminStats]);



  const latestTickets = useMemo(() => (

    [...tickets]

      .sort((a, b) => new Date(b.fechaCreacion || b.fecha) - new Date(a.fechaCreacion || a.fecha))

      .slice(0, 6)

  ), [tickets]);



  return (

    <div className="reports-wrapper">

      <div className="reports-header">

        <div>

          <h2>Reportes del sistema</h2>

          <p className="reports-subtitle">Resumen ejecutivo del estado actual de los tickets y rendimiento.</p>

        </div>

        <div className="reports-actions">
          <button type="button" className="refresh-btn" onClick={loadTickets}>Actualizar</button>
          <button type="button" className="refresh-btn no-print" onClick={handleExportPDF}>Exportar (PDF)</button>
        </div>

      </div>

      <div ref={exportRef}>

      {loading && <div className="reports-placeholder">Cargando informaci�n...</div>}

      {error && !loading && <div className="reports-error">{error}</div>}



      {!loading && !error && (

        <>

          <section className="report-summary">

            <div className="report-card">

              <div className="report-icon primary">

                <FiMessageSquare />

              </div>

              <div className="report-info">

                <span className="report-value">{adminStats?.ticketsTotal ?? tickets.length}</span>

                <span className="report-label">Tickets totales</span>

              </div>

            </div>

            <div className="report-card">

              <div className="report-icon warning">

                <FiTrendingUp />

              </div>

              <div className="report-info">

                <span className="report-value">{adminStats?.ticketsActivos ?? (metrics.statusCounts.Esperando + metrics.statusCounts.Asignado + metrics.statusCounts.EnProgreso)}</span>

                <span className="report-label">Tickets activos</span>

              </div>

            </div>

            <div className="report-card">

              <div className="report-icon success">

                <FiPieChart />

              </div>

              <div className="report-info">

                <span className="report-value">{adminStats?.ticketsResueltos ?? metrics.statusCounts.Resuelto}</span>

                <span className="report-label">Tickets resueltos</span>

              </div>

            </div>

            <div className="report-card">

              <div className="report-icon neutral">

                <FiClock />

              </div>

              <div className="report-info">

                <span className="report-value">{metrics.averageResolution.toFixed(1)} h</span>

                <span className="report-label">Tiempo medio de resoluci�n</span>

              </div>

            </div>

          </section>



          <section className="reports-grid">

            <div className="report-panel">

              <h3>Estado de los tickets</h3>

              <div className="status-chart">

                {Object.entries(metrics.statusCounts).map(([key, count]) => (

                  <div key={key} className="status-item">

                    <div className="status-label">

                      <span>{key}</span>

                      <span>{count}</span>

                    </div>

                    <div className="status-bar">

                      <div

                        className={`status-fill status-${key.toLowerCase()}`}

                        style={{ width: `${tickets.length ? (count / tickets.length) * 100 : 0}%` }}

                      />

                    </div>

                  </div>

                ))}

              </div>

            </div>



            <div className="report-panel">

              <h3>Tendencia de tickets (7 dias)</h3>

              <div className="trend-chart">

                {metrics.last7Days.map((day) => (

                  <div key={day.key} className="trend-bar">

                    <div

                      className="trend-bar-inner"

                      style={{ height: `${metrics.maxDaily ? (day.count / metrics.maxDaily) * 100 : 0}%` }}

                    >

                      <span className="trend-count">{day.count}</span>

                    </div>

                    <span className="trend-label">{day.label}</span>

                  </div>

                ))}

              </div>

            </div>



            <div className="report-panel">

              <h3>Satisfaccion del usuario</h3>

              <div className="satisfaction-card">

                <span className="satisfaction-score">{metrics.averageSatisfaction.toFixed(2)}/5</span>

                <p>Promedio basado en calificaciones registradas.</p>

                {adminStats?.ticketsSinAsignar != null && (

                  <p className="satisfaction-note">Tickets sin asignar: <strong>{adminStats.ticketsSinAsignar}</strong></p>

                )}

              </div>

            </div>

          </section>



          <section className="report-panel">

            <h3>Tickets recientes</h3>

            {latestTickets.length === 0 ? (

              <p className="reports-placeholder">Aun no hay tickets registrados.</p>

            ) : (

              <table className="reports-table">

                <thead>

                  <tr>

                    <th>ID</th>

                    <th>Titulo</th>

                    <th>Estado</th>

                    <th>Prioridad</th>

                    <th>Creado</th>

                  </tr>

                </thead>

                <tbody>

                  {latestTickets.map((ticket) => (

                    <tr key={ticket.id}>

                      <td>{ticket.id}</td>

                      <td>{ticket.titulo}</td>

                      <td>{ticket.estado}</td>

                      <td>{ticket.prioridad || 'Media'}</td>

                      <td>{new Date(ticket.fechaCreacion || ticket.fecha).toLocaleString()}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </section>

        </>

      )}

      </div>

    </div>

  );

}





