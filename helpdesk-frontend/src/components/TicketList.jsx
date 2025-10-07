import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './TicketList.css';
import { FiEdit2, FiTrash2, FiUserPlus, FiRefreshCw, FiStar, FiSearch } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';

const STATUS_LABELS = {
  Esperando: 'Esperando',
  Asignado: 'Asignado',
  EnProgreso: 'En progreso',
  Resuelto: 'Resuelto'
};

const formatDateTime = (value) => {
  if (!value) {
    return '-';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleString();
};

const parseDateBoundary = (value, edge) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  if (edge === 'end') {
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }

  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

function TicketList({ token, role = 'Solicitante' }) {
  const [tickets, setTickets] = useState([]);
  const [userId, setUserId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortOption, setSortOption] = useState('fecha_desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);
  const [assignSelection, setAssignSelection] = useState('');
  const [assignError, setAssignError] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const statusOptions = useMemo(() => {
    if (role === 'Administrador') {
      return [
        { value: 'todos', label: 'Todos los tickets' },
        { value: 'sin_resolver', label: 'Sin resolver' },
        { value: 'resueltos', label: 'Resueltos' },
        { value: 'sin_asignar', label: 'Sin asignar' }
      ];
    }

    if (role === 'Tecnico') {
      return [
        { value: 'todos', label: 'Todos mis tickets' },
        { value: 'pendientes', label: 'Pendientes' },
        { value: 'en_progreso', label: 'En progreso' },
        { value: 'resueltos', label: 'Resueltos' }
      ];
    }

    return [];
  }, [role]);

  const sortOptionsAvailable = useMemo(() => {
    const common = [
      { value: 'fecha_desc', label: 'Fecha (recientes primero)' },
      { value: 'fecha_asc', label: 'Fecha (antiguos primero)' },
      { value: 'estado_flow', label: 'Estado (pendientes primero)' },
      { value: 'estado_flow_desc', label: 'Estado (resueltos primero)' },
      { value: 'titulo_asc', label: 'Titulo (A-Z)' },
      { value: 'titulo_desc', label: 'Titulo (Z-A)' }
    ];

    if (role === 'Administrador') {
      return common;
    }

    if (role === 'Tecnico') {
      return common;
    }

    return [];
  }, [role]);

  const defaultStatusFilter = statusOptions.length > 0 ? statusOptions[0].value : 'todos';
  const defaultSortOption = sortOptionsAvailable.length > 0 ? sortOptionsAvailable[0].value : 'fecha_desc';

  useEffect(() => {
    if (statusOptions.length > 0 && !statusOptions.some((option) => option.value === statusFilter)) {
      setStatusFilter(statusOptions[0].value);
    }
  }, [statusOptions, statusFilter]);

  useEffect(() => {
    if (sortOptionsAvailable.length > 0 && !sortOptionsAvailable.some((option) => option.value === sortOption)) {
      setSortOption(sortOptionsAvailable[0].value);
    }
  }, [sortOptionsAvailable, sortOption]);

  const fetchTechnicians = useCallback(async () => {
    if (role !== 'Administrador' || !token) {
      setTechnicians([]);
      return;
    }

    setIsLoadingTechnicians(true);

    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data)
          ? data.reduce((acc, user) => {
              const roleValue = user?.rol ?? user?.Rol ?? user?.ROLE;
              if ((roleValue ?? '').toLowerCase() !== 'tecnico') {
                return acc;
              }

              const id = user?.id ?? user?.Id;
              if (id == null) {
                return acc;
              }

              const name = (user?.nombre ?? user?.Nombre ?? `Tecnico ${id}`).toString().trim();
              acc.push({ id, name });
              return acc;
            }, [])
          : [];

        list.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
        setTechnicians(list);
      }
    } catch {
      // noop
    } finally {
      setIsLoadingTechnicians(false);
    }
  }, [token, role]);

  useEffect(() => {
    if (role === 'Administrador' && token) {
      fetchTechnicians();
    } else {
      setTechnicians([]);
      setAssignTarget(null);
      setAssignSelection('');
    }

    if (role !== 'Administrador') {
      setAssignError('');
      setIsAssigning(false);
    }
  }, [role, token, fetchTechnicians]);

  useEffect(() => {
    if (!token) {
      setUserId(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload?.nameid || payload?.sub || payload?.userId || payload?.id;
      setUserId(id ? Number(id) : null);
    } catch {
      setUserId(null);
    }
  }, [token]);

  const fetchTickets = useCallback(async () => {
    if (!token) {
      setTickets([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(Array.isArray(data) ? data : []);
      }
    } catch {
      // noop
    }
  }, [token]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const openAssignPanel = (ticket) => {
    if (assignTarget?.id === ticket.id) {
      closeAssignPanel();
      return;
    }

    setAssignTarget(ticket);
    setAssignSelection(ticket?.tecnicoId ? String(ticket.tecnicoId) : '');
    setAssignError('');
    if (role === 'Administrador' && technicians.length === 0) {
      fetchTechnicians();
    }
  };

  const closeAssignPanel = () => {
    setAssignTarget(null);
    setAssignSelection('');
    setAssignError('');
  };

  const handleAssignSubmit = async () => {
    if (!assignTarget) {
      return;
    }

    if (!assignSelection) {
      setAssignError('Selecciona un tecnico para continuar.');
      return;
    }

    setIsAssigning(true);
    setAssignError('');

    try {
      const response = await fetch(`${API_URL}/tickets/${assignTarget.id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tecnicoId: Number(assignSelection) })
      });

      if (response.ok) {
        closeAssignPanel();
        fetchTickets();
      } else {
        setAssignError('No se pudo asignar el ticket. Intenta de nuevo.');
      }
    } catch {
      setAssignError('No se pudo asignar el ticket. Intenta de nuevo.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    if (!newStatus) {
      return;
    }

    setStatusUpdatingId(ticketId);

    try {
      await fetch(`${API_URL}/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado: newStatus })
      });

      fetchTickets();
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleEdit = async (ticket) => {
    const titulo = prompt('Nuevo titulo:', ticket.titulo);
    if (titulo === null) {
      return;
    }

    const descripcion = prompt('Nueva descripcion:', ticket.descripcion || '') || '';

    await fetch(`${API_URL}/tickets/${ticket.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id: ticket.id,
        titulo,
        descripcion,
        tecnicoId: ticket.tecnicoId,
        estado: ticket.estado
      })
    });

    fetchTickets();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar ticket?')) {
      return;
    }

    await fetch(`${API_URL}/tickets/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchTickets();
  };

  const estados = [
    { value: 'Esperando', label: 'Esperando' },
    { value: 'Asignado', label: 'Asignado' },
    { value: 'EnProgreso', label: 'En Progreso' },
    { value: 'Resuelto', label: 'Resuelto' }
  ];

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

    return Object.prototype.hasOwnProperty.call(map, estadoVal) ? map[estadoVal] : (estadoVal || '');
  };

  const getStatusLabel = (estadoVal) => {
    const normalized = mapEstado(estadoVal);
    return STATUS_LABELS[normalized] || normalized || '-';
  };

  const getStatusClass = (estadoVal) => {
    const normalized = mapEstado(estadoVal);
    return normalized
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  };

  const baseTickets = useMemo(() => {
    if (role === 'Solicitante' && userId) {
      return tickets.filter((t) => t.usuarioId === userId);
    }

    if (role === 'Tecnico' && userId) {
      return tickets.filter((t) => String(t.tecnicoId) === String(userId));
    }

    return tickets;
  }, [tickets, role, userId]);

  const filteredTickets = useMemo(() => {
    let working = [...baseTickets];

    let startDate = parseDateBoundary(dateFrom, 'start');
    let endDate = parseDateBoundary(dateTo, 'end');

    if (startDate && endDate && startDate > endDate) {
      const temp = startDate;
      startDate = endDate;
      endDate = temp;
    }

    if (role === 'Administrador') {
      if (statusFilter === 'sin_resolver') {
        working = working.filter((ticket) => mapEstado(ticket.estado) !== 'Resuelto');
      } else if (statusFilter === 'resueltos') {
        working = working.filter((ticket) => mapEstado(ticket.estado) === 'Resuelto');
      } else if (statusFilter === 'sin_asignar') {
        working = working.filter((ticket) => ticket.tecnicoId == null);
      }
    } else if (role === 'Tecnico') {
      if (statusFilter === 'pendientes') {
        working = working.filter((ticket) => {
          const status = mapEstado(ticket.estado);
          return status === 'Esperando' || status === 'Asignado';
        });
      } else if (statusFilter === 'en_progreso') {
        working = working.filter((ticket) => mapEstado(ticket.estado) === 'EnProgreso');
      } else if (statusFilter === 'resueltos') {
        working = working.filter((ticket) => mapEstado(ticket.estado) === 'Resuelto');
      }
    }

    if (startDate || endDate) {
      working = working.filter((ticket) => {
        const rawDate = ticket.fechaCreacion || ticket.fecha;
        if (!rawDate) {
          return false;
        }

        const ticketDate = new Date(rawDate);
        if (Number.isNaN(ticketDate.getTime())) {
          return false;
        }

        if (startDate && ticketDate < startDate) {
          return false;
        }

        if (endDate && ticketDate > endDate) {
          return false;
        }

        return true;
      });
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (normalizedSearch) {
      working = working.filter((ticket) => {
        const technicianName =
          ticket.tecnico?.nombre ?? ticket.tecnico?.Nombre ?? ticket.tecnico?.name ?? '';
        const requesterName =
          ticket.solicitante?.nombre ??
          ticket.solicitante?.Nombre ??
          ticket.usuario?.nombre ??
          ticket.usuario?.Nombre ??
          '';
        const statusLabel = getStatusLabel(ticket.estado);
        const dateLabel = formatDateTime(ticket.fechaCreacion || ticket.fecha);

        const fields = [
          ticket.id != null ? `#${ticket.id}` : '',
          ticket.titulo,
          ticket.descripcion,
          ticket.categoria,
          ticket.prioridad,
          technicianName,
          requesterName,
          statusLabel,
          dateLabel
        ];

        return fields.some((value) => {
          if (!value) {
            return false;
          }

          return value.toString().toLowerCase().includes(normalizedSearch);
        });
      });
    }

    const statusOrder = ['Esperando', 'Asignado', 'EnProgreso', 'Resuelto'];
    const getStatusRank = (ticket) => {
      const idx = statusOrder.indexOf(mapEstado(ticket.estado));
      return idx === -1 ? statusOrder.length : idx;
    };

    working.sort((a, b) => {
      const fechaA = new Date(a.fechaCreacion || a.fecha);
      const fechaB = new Date(b.fechaCreacion || b.fecha);

      switch (sortOption) {
        case 'fecha_asc':
          return fechaA - fechaB;
        case 'fecha_desc':
          return fechaB - fechaA;
        case 'titulo_asc':
          return (a.titulo || '').localeCompare(b.titulo || '');
        case 'titulo_desc':
          return (b.titulo || '').localeCompare(a.titulo || '');
        case 'estado_flow':
          return getStatusRank(a) - getStatusRank(b);
        case 'estado_flow_desc':
          return getStatusRank(b) - getStatusRank(a);
        default:
          return 0;
      }
    });

    return working;
  }, [baseTickets, role, statusFilter, sortOption, dateFrom, dateTo, searchTerm]);


  const getTechnicianAction = (estadoVal) => {
    const normalized = mapEstado(estadoVal);

    if (normalized === 'Esperando' || normalized === 'Asignado') {
      return { label: 'Marcar en progreso', next: 'EnProgreso', disabled: false };
    }

    if (normalized === 'EnProgreso') {
      return { label: 'Marcar resuelto', next: 'Resuelto', disabled: false };
    }

    return { label: 'Resuelto', next: null, disabled: true };
  };

  const renderStars = (value) => {
    const rating = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));

    return Array.from({ length: 5 }, (_, index) => (
      <FiStar key={index} className={`star-icon${index < rating ? ' filled' : ''}`} aria-hidden="true" />
    ));
  };

  const rateTicket = async (ticketId, rating) => {
    await fetch(`${API_URL}/tickets/${ticketId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ calificacion: rating })
    });

    fetchTickets();
  };


  const showStatusFilter = statusOptions.length > 0;
  const isFilterDirty =
    statusFilter !== defaultStatusFilter ||
    sortOption !== defaultSortOption ||
    Boolean(dateFrom) ||
    Boolean(dateTo) ||
    Boolean(searchTerm.trim());

  return (
    <div className="ticket-list-container">
      <div className="ticket-header">
        <h2>Tickets</h2>
        <button type="button" className="refresh-btn" onClick={fetchTickets}>
          <FiRefreshCw aria-hidden="true" />
          <span>Actualizar</span>
        </button>
      </div>


      <div className="ticket-filters" role="region" aria-label="Filtros de tickets">
        {showStatusFilter && (
          <div className="filter-group">
            <label htmlFor="ticket-filter-status">Filtrar</label>
            <select
              id="ticket-filter-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-group filter-group--range">
          <label htmlFor="ticket-date-from">Rango de fechas</label>
          <div className="date-range">
            <input
              type="date"
              id="ticket-date-from"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
            <span className="date-range__separator">a</span>
            <input
              type="date"
              id="ticket-date-to"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              aria-label="Fecha fin"
            />
          </div>
        </div>

        <div className="filter-group filter-group--search">
          <label htmlFor="ticket-search">Buscar</label>
          <div className="search-input">
            <input
              type="search"
              id="ticket-search"
              placeholder="Buscar por titulo, descripcion, estado..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <FiSearch aria-hidden="true" className="search-icon" />
          </div>
        </div>

        <button
          type="button"
          className="reset-btn"
          onClick={() => {
            setStatusFilter(defaultStatusFilter);
            setSortOption(defaultSortOption);
            setDateFrom('');
            setDateTo('');
            setSearchTerm('');
          }}
          disabled={!isFilterDirty}
        >
          Limpiar filtros
        </button>
      </div>
      {filteredTickets.length === 0 ? (
        <p className="empty-state">No hay tickets que coincidan con tu criterio.</p>
      ) : (
        <div className="table-wrapper" role="region" aria-live="polite">
          <table className="ticket-table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Titulo</th>
                <th scope="col">Descripcion</th>
                <th scope="col">Tecnico</th>
                <th scope="col">Estado</th>
                <th scope="col">Calificacion</th>
                {role === 'Administrador' && <th scope="col">Acciones</th>}
                {role === 'Tecnico' && <th scope="col">Cambiar estado</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => {
                const statusClass = getStatusClass(ticket.estado);
                const statusLabel = getStatusLabel(ticket.estado);
                const technicianName =
                  ticket.tecnico?.nombre ??
                  ticket.tecnico?.Nombre ??
                  ticket.tecnico?.name ??
                  'Sin asignar';
                const createdLabel = formatDateTime(ticket.fechaCreacion || ticket.fecha);
                const description = ticket.descripcion || 'Sin descripcion';
                const technicianAction = getTechnicianAction(ticket.estado);

                return (
                  <tr key={ticket.id}>
                    <td className="cell-id">
                      <span className="id-badge">#{ticket.id}</span>
                      <span className="cell-date">{createdLabel}</span>
                    </td>
                    <td className="cell-title">
                      <strong>{ticket.titulo}</strong>
                    </td>
                    <td className="cell-description">{description}</td>
                    <td className="cell-technician">
                      <span className={`technician-badge${technicianName === 'Sin asignar' ? ' unassigned' : ''}`}>
                        {technicianName}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill status-${statusClass}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td>
                      {role === 'Solicitante' && mapEstado(ticket.estado) === 'Resuelto' && !ticket.calificacion ? (
                        <div className="star-group" role="group" aria-label="Calificar ticket resuelto">
                          {[1, 2, 3, 4, 5].map((ratingValue) => (
                            <button
                              type="button"
                              key={ratingValue}
                              onClick={() => rateTicket(ticket.id, ratingValue)}
                              title={`${ratingValue} estrella(s)`}
                              className="star-btn"
                            >
                              <FiStar aria-hidden="true" />
                              <span className="sr-only">{`${ratingValue} estrella(s)`}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div
                          className="star-display"
                          aria-label={
                            ticket.calificacion ? `Calificacion ${ticket.calificacion} de 5` : 'Sin calificacion'
                          }
                        >
                          {renderStars(ticket.calificacion)}
                        </div>
                      )}
                    </td>
                    {role === 'Administrador' && (
                      <td className="ticket-actions">
                        <div className="action-group">
                          <button
                            type="button"
                            className="table-action-btn assign"
                            onClick={() => openAssignPanel(ticket)}
                            title="Asignar ticket"
                            aria-label={`Asignar ticket ${ticket.id}`}
                            data-label="Asignar"
                          >
                            <FiUserPlus aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="table-action-btn edit"
                            onClick={() => handleEdit(ticket)}
                            title="Editar ticket"
                            aria-label={`Editar ticket ${ticket.id}`}
                            data-label="Editar"
                          >
                            <FiEdit2 aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="table-action-btn delete"
                            onClick={() => handleDelete(ticket.id)}
                            title="Eliminar ticket"
                            aria-label={`Eliminar ticket ${ticket.id}`}
                            data-label="Eliminar"
                          >
                            <FiTrash2 aria-hidden="true" />
                          </button>
                        </div>
                        {assignTarget && assignTarget.id === ticket.id && (
                          <div className="assign-panel" role="dialog" aria-label={`Asignar tecnico al ticket ${ticket.id}`}>
                            <div className="assign-panel__header">
                              <span>Asignar tecnico</span>
                              <button
                                type="button"
                                className="assign-panel__close"
                                onClick={closeAssignPanel}
                                aria-label="Cerrar selector de tecnico"
                              >
                                X
                              </button>
                            </div>
                            <div className="assign-panel__body">
                              {isLoadingTechnicians ? (
                                <span className="assign-panel__status">Cargando tecnicos...</span>
                              ) : technicians.length === 0 ? (
                                <span className="assign-panel__status">No hay tecnicos disponibles.</span>
                              ) : (
                                <>
                                  <label htmlFor={`assign-tech-${ticket.id}`} className="assign-panel__label">
                                    Selecciona un tecnico
                                  </label>
                                  <select
                                    id={`assign-tech-${ticket.id}`}
                                    className="assign-panel__select"
                                    value={assignSelection}
                                    onChange={(event) => {
                                      setAssignSelection(event.target.value);
                                      setAssignError('');
                                    }}
                                  >
                                    <option value="">Selecciona una opcion</option>
                                    {technicians.map((tech) => (
                                      <option key={tech.id} value={tech.id}>
                                        {tech.name}
                                      </option>
                                    ))}
                                  </select>
                                </>
                              )}
                              {assignError && <p className="assign-panel__error">{assignError}</p>}
                            </div>
                            <div className="assign-panel__actions">
                              <button type="button" className="assign-panel__button ghost" onClick={closeAssignPanel}>
                                Cancelar
                              </button>
                              <button
                                type="button"
                                className="assign-panel__button primary"
                                onClick={handleAssignSubmit}
                                disabled={isAssigning || isLoadingTechnicians || technicians.length === 0}
                              >
                                {isAssigning ? 'Asignando...' : 'Asignar'}
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    )}
                    {role === 'Tecnico' && (
                      <td className="ticket-actions">
                        <button
                          type="button"
                          className="status-action-btn"
                          onClick={() => {
                            if (!technicianAction.next) {
                              return;
                            }

                            handleStatusChange(ticket.id, technicianAction.next);
                          }}
                          disabled={technicianAction.disabled || statusUpdatingId === ticket.id}
                        >
                          {technicianAction.label}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TicketList;
