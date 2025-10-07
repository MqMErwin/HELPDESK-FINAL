import React, { useState } from 'react';
import './TicketForm.css';
import { FiSend, FiRotateCcw, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';

const INITIAL_FEEDBACK = { text: '', tone: 'idle' };

function TicketForm({ token, onCreated }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFields = () => {
    setTitulo('');
    setDescripcion('');
  };

  const handleReset = () => {
    clearFields();
    setFeedback(INITIAL_FEEDBACK);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token || isSubmitting) {
      return;
    }

    setFeedback(INITIAL_FEEDBACK);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, descripcion })
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      setFeedback({
        tone: 'success',
        text: `Ticket creado exitosamente (#${data?.id ?? 'N/A'})`
      });
      clearFields();
      if (onCreated) {
        onCreated();
      }
    } catch (error) {
      setFeedback({
        tone: 'error',
        text: 'No se pudo crear el ticket. Intenta nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFeedbackIcon = feedback.tone === 'success'
    ? <FiCheckCircle aria-hidden="true" className="feedback-icon" />
    : <FiAlertTriangle aria-hidden="true" className="feedback-icon" />;

  return (
    <div className="ticket-form-container">
      <div className="ticket-form-card">
        <div className="ticket-form-header">
          <div>
            <h2>Crear ticket</h2>
            <p>Describe el incidente para que el equipo pueda atenderlo con prioridad.</p>
          </div>
        </div>

        <form className="ticket-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field" htmlFor="ticket-title">
              <span className="field-label">Titulo</span>
              <input
                id="ticket-title"
                className="field-control"
                type="text"
                placeholder="Ej. Problema con acceso al sistema"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
                maxLength={120}
                required
              />
              <span className="field-hint">Resume el problema en una frase breve.</span>
            </label>

            <label className="form-field" htmlFor="ticket-description">
              <span className="field-label">Descripcion</span>
              <textarea
                id="ticket-description"
                className="field-control"
                placeholder="Incluye detalles clave como mensajes de error, tiempo y pasos realizados."
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
                rows={6}
              />
              <span className="field-hint">Cuanta mas informacion, mas rapido podremos ayudarte.</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              <FiSend aria-hidden="true" className="btn-icon" />
              <span>{isSubmitting ? 'Enviando...' : 'Crear ticket'}</span>
            </button>
            <button
              type="button"
              className="reset-btn"
              onClick={handleReset}
              disabled={isSubmitting || (!titulo && !descripcion)}
            >
              <FiRotateCcw aria-hidden="true" className="btn-icon" />
              <span>Limpiar</span>
            </button>
          </div>

          {feedback.text && feedback.tone !== 'idle' && (
            <div className={`form-feedback ${feedback.tone}`} role="status">
              {renderFeedbackIcon}
              <span>{feedback.text}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default TicketForm;
