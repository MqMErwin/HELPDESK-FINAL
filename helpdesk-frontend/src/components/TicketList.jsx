import React, { useEffect, useState } from 'react';
import TicketForm from './TicketForm';
import './TicketList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';

function TicketList({ token, role = 'Solicitante' }) {
  const [tickets, setTickets] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload?.nameid || payload?.sub || payload?.userId || payload?.id;
      setUserId(id ? Number(id) : null);
    } catch {
      setUserId(null);
    }
  }, [token]);

  const fetchTickets = async () => {
    const response = await fetch(`${API_URL}/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setTickets(data);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const handleAssign = async (ticketId) => {
    const tecnicoId = prompt('Ingrese el ID del técnico:');
    if (!tecnicoId) return;
    await fetch(`${API_URL}/tickets/${ticketId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ tecnicoId: Number(tecnicoId) })
    });
    fetchTickets();
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    await fetch(`${API_URL}/tickets/${ticketId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ estado: newStatus })
    });
    fetchTickets();
  };

  const handleEdit = async (ticket) => {
    const titulo = prompt('Nuevo título:', ticket.titulo);
    if (titulo === null) return;
    const descripcion = prompt('Nueva descripción:', ticket.descripcion) || '';
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
    if (!window.confirm('Eliminar ticket?')) return;
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

  const visibleTickets =
    role === 'Solicitante' && userId
      ? tickets.filter(t => t.usuarioId === userId)
      : tickets;

  return (
    <div className="ticket-list-container">
      <h2>Tickets</h2>
      {role === 'Administrador' && <TicketForm token={token} onCreated={fetchTickets} />}
      {visibleTickets.length === 0 ? (
        <p>No tienes tickets registrados.</p>
      ) : (
        <ul className="ticket-list">
          {visibleTickets.map(ticket => (
            <li key={ticket.id} className="ticket-item">
              <div className="ticket-header">
                <strong>#{ticket.id} {ticket.titulo}</strong>
                <span className="ticket-status">{ticket.estado}</span>
              </div>
              <p>{ticket.descripcion}</p>
              {role === 'Administrador' && (
                <div className="ticket-actions">
                  <button onClick={() => handleAssign(ticket.id)}>Asignar</button>
                  <button onClick={() => handleEdit(ticket)}>Editar</button>
                  <button onClick={() => handleDelete(ticket.id)}>Eliminar</button>
                </div>
              )}
              {role === 'Tecnico' && (
                <div className="ticket-actions">
                  <select
                    value={ticket.estado}
                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                  >
                    {estados.map(e => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TicketList;
