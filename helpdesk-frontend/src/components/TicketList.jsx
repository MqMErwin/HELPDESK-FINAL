import React, { useEffect, useState } from 'react';
import TicketForm from './TicketForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';

function TicketList({ token, role }) {
  const [tickets, setTickets] = useState([]);

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

  return (
    <div>
      <h2>Tickets</h2>
      {role === 'Administrador' && <TicketForm token={token} onCreated={fetchTickets} />}
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id} style={{ marginBottom: '1em' }}>
            <strong>#{ticket.id} {ticket.titulo}</strong> - {ticket.estado}
            <p>{ticket.descripcion}</p>
            {role === 'Administrador' && (
              <>
                <button onClick={() => handleAssign(ticket.id)}>Asignar</button>
                <button onClick={() => handleEdit(ticket)}>Editar</button>
                <button onClick={() => handleDelete(ticket.id)}>Eliminar</button>
              </>
            )}
            {role === 'Tecnico' && (
              <select
                value={ticket.estado}
                onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
              >
                {estados.map(e => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TicketList;
