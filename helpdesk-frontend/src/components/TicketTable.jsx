import React, { useEffect, useState } from 'react';
import './TicketTable.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';

export default function TicketTable({ token }) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`${API_URL}/tickets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
        }
      } catch (e) {
        // noop
      }
    };
    fetchTickets();
  }, [token]);

  return (
    <div>
      <h2 className="ticket-table-title">Lista de Tickets</h2>
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titulo</th>
            <th>Descripcion</th>
            <th>Tecnico</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.titulo}</td>
              <td>{t.descripcion}</td>
              <td>{t.tecnico && t.tecnico.nombre ? t.tecnico.nombre : 'Sin asignar'}</td>
              <td>{t.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

