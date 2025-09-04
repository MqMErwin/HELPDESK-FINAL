import React, { useEffect, useState } from 'react';
import './UserManagement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';

export default function UserManagement({ token }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', rol: 'Solicitante' });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/users/${editingId}` : `${API_URL}/users`;
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...form, id: editingId })
    });
    if (response.ok) {
      setForm({ nombre: '', correo: '', contrasena: '', rol: 'Solicitante' });
      setEditingId(null);
      fetchUsers();
    }
  };

  const handleEdit = (user) => {
    setForm({ nombre: user.nombre, correo: user.correo, contrasena: user.contrasena, rol: user.rol });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar usuario?')) return;
    await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchUsers();
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ nombre: '', correo: '', contrasena: '', rol: 'Solicitante' });
  };

  return (
    <div className="user-management">
      <h2>Usuarios</h2>
      <form className="user-form" onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="correo"
          placeholder="Correo"
          type="email"
          value={form.correo}
          onChange={handleChange}
          required
        />
        <input
          name="contrasena"
          placeholder="Contraseña"
          type="password"
          value={form.contrasena}
          onChange={handleChange}
          required
        />
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="Solicitante">Solicitante</option>
          <option value="Tecnico">Tecnico</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
        {editingId && (
          <button type="button" onClick={handleCancel}>Cancelar</button>
        )}
      </form>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Editar</button>
                <button onClick={() => handleDelete(u.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
