import React, { useCallback, useEffect, useState } from 'react';
import './UserManagement.css';
import { FiEdit2, FiTrash2, FiUserPlus, FiUserCheck, FiRefreshCw, FiX } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';
const INITIAL_FORM = { nombre: '', correo: '', contrasena: '', rol: 'Solicitante' };

const ROLE_OPTIONS = [
  { value: 'Solicitante', label: 'Solicitante' },
  { value: 'Tecnico', label: 'Tecnico' },
  { value: 'Administrador', label: 'Administrador' }
];

export default function UserManagement({ token }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setUsers([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch {
      // noop
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    setIsSaving(true);

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/users/${editingId}` : `${API_URL}/users`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, id: editingId })
      });

      if (response.ok) {
        setForm(INITIAL_FORM);
        setEditingId(null);
        fetchUsers();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (user) => {
    setForm({
      nombre: user?.nombre || '',
      correo: user?.correo || '',
      contrasena: user?.contrasena || '',
      rol: user?.rol || 'Solicitante'
    });
    setEditingId(user?.id ?? null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar usuario?')) {
      return;
    }

    await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchUsers();
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
  };

  const isEditing = Boolean(editingId);

  return (
    <div className="user-management-container">
      <div className="user-header">
        <div>
          <h2>Gestion de usuarios</h2>
          <p className="user-subtitle">Administra roles y credenciales con una vista mas clara.</p>
        </div>
        <button type="button" className="refresh-btn" onClick={fetchUsers}>
          <FiRefreshCw aria-hidden="true" />
          <span>Actualizar lista</span>
        </button>
      </div>

      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span className="field-label">Nombre</span>
            <input
              className="input-control"
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-field">
            <span className="field-label">Correo</span>
            <input
              className="input-control"
              name="correo"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-field">
            <span className="field-label">Contrasena</span>
            <input
              className="input-control"
              name="contrasena"
              type="password"
              placeholder="Contrasena"
              value={form.contrasena}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-field">
            <span className="field-label">Rol</span>
            <select
              className="input-control"
              name="rol"
              value={form.rol}
              onChange={handleChange}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={isSaving}>
            {isEditing ? (
              <>
                <FiUserCheck aria-hidden="true" className="btn-icon" />
                <span>Actualizar usuario</span>
              </>
            ) : (
              <>
                <FiUserPlus aria-hidden="true" className="btn-icon" />
                <span>Crear usuario</span>
              </>
            )}
          </button>
          {isEditing && (
            <button
              type="button"
              className="ghost-btn"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <FiX aria-hidden="true" className="btn-icon" />
              <span>Cancelar</span>
            </button>
          )}
        </div>
      </form>

      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Correo</th>
              <th scope="col">Rol</th>
              <th scope="col" className="actions-header">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">No hay usuarios registrados.</div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="cell-id">
                    <span className="id-badge">#{user.id}</span>
                  </td>
                  <td className="cell-name">
                    <strong>{user.nombre}</strong>
                  </td>
                  <td className="cell-email">{user.correo}</td>
                  <td>
                    <span className={`role-pill role-${(user.rol || 'Solicitante').toLowerCase()}`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className="user-actions">
                    <div className="action-group">
                      <button
                        type="button"
                        className="table-action-btn edit"
                        onClick={() => handleEdit(user)}
                        title={`Editar usuario ${user.nombre}`}
                        aria-label={`Editar usuario ${user.nombre}`}
                        data-label="Editar"
                      >
                        <FiEdit2 aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="table-action-btn delete"
                        onClick={() => handleDelete(user.id)}
                        title={`Eliminar usuario ${user.nombre}`}
                        aria-label={`Eliminar usuario ${user.nombre}`}
                        data-label="Eliminar"
                      >
                        <FiTrash2 aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
