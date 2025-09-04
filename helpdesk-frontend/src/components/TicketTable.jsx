import React, { useEffect, useState } from 'react';
import './TicketTable.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';

export default function TicketTable({ token }) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const response = await fetch(`${API_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    };
    fetchTickets();
  }, [token]);

  return (
    <div>
      <h2>Lista de Tickets</h2>
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.titulo}</td>
              <td>{t.descripcion}</td>
              <td>{t.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
