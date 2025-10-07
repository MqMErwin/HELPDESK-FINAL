import React, { useState, useEffect, useRef, useMemo } from 'react';
import './ChatBotWidget.css';

export default function ChatBotWidget({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentFlow, setCurrentFlow] = useState(null); // 'login_issue' | 'device_issue' | 'notes_issue' | 'other_issue'
  const [awaitingOtherDescription, setAwaitingOtherDescription] = useState(false);
  const [awaitingCreateConfirm, setAwaitingCreateConfirm] = useState(false);
  const [pendingTitle, setPendingTitle] = useState(null);
  const [pendingDescription, setPendingDescription] = useState(null);
  const [messages, setMessages] = useState([
    { text: '\u00a1Hola! Soy el asistente de soporte de la EMI Cochabamba.', sender: 'bot' },
    {
      text: '\u00bfEres estudiante, docente o personal administrativo?',
      sender: 'bot',
      buttons: [
        { title: 'Estudiante', payload: 'Estudiante' },
        { title: 'Docente', payload: 'Docente' },
        { title: 'Administrativo', payload: 'Administrativo' }
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => (userId ? String(userId) : 'guest_' + Math.random().toString(36).slice(2, 11)));
  const messagesEndRef = useRef(null);

  const RASA_ENDPOINT = 'http://localhost:5005/webhooks/rest/webhook';
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';

  const getButtonsForRole = (role) => {
    if (role === 'Docente') {
      return [
        { title: 'Inicio de sesion', payload: 'issue_login' },
        { title: 'Dispositivo', payload: 'issue_device' },
        { title: 'Cargado de notas', payload: 'issue_notes' },
        { title: 'Otros', payload: 'issue_other' }
      ];
    }
    // Estudiante y Administrativo: opciones reducidas
    return [
      { title: 'Inicio de sesion', payload: 'issue_login' },
      { title: 'Otros', payload: 'issue_other' }
    ];
  };

  // Load saved messages
  useEffect(() => {
    const saved = localStorage.getItem('chatMessages');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Persist messages and autoscroll
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleToggle = () => {
    setIsOpen((o) => !o);
    if (!isOpen) setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  // Create ticket using backend API
  const createTicket = async (titulo, descripcion) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessages((prev) => [...prev, { text: 'Para crear un ticket necesitas iniciar sesión.', sender: 'bot' }]);
      return null;
    }
    try {
      const res = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ titulo, descripcion })
      });
      if (!res.ok) {
        if (res.status === 403) {
          setMessages((prev) => [...prev, { text: 'No tienes permisos para crear tickets con este usuario.', sender: 'bot' }]);
          return null;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setMessages((prev) => [...prev, { text: `Ticket creado con ID ${data.id}. ¡Gracias!`, sender: 'bot' }]);
      return data;
    } catch (e) {
      setMessages((prev) => [...prev, { text: 'Ocurrió un error al crear el ticket. Intenta más tarde.', sender: 'bot' }]);
      return null;
    }
  };

  const promptCreateTicket = (title, description) => {
    setPendingTitle(title);
    setPendingDescription(description);
    setAwaitingCreateConfirm(true);
    setMessages((prev) => [
      ...prev,
      { text: `¿Deseas que cree un ticket con el asunto: "${title}"?`, sender: 'bot', buttons: [
        { title: 'Crear ticket', payload: 'cta_create' },
        { title: 'No, gracias', payload: 'cta_skip' }
      ] }
    ]);
  };

  const handleSend = async (textToSend = null, displayText = null) => {
    const message = textToSend || newMessage.trim();
    if (!message) return;

    // add user message
    const userMessage = { text: displayText || message, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setNewMessage('');

    // role selection → role-specific options
    if ([ 'Estudiante', 'Docente', 'Administrativo' ].includes(message)) {
      setSelectedRole(message);
      const buttons = getButtonsForRole(message);
      setMessages((prev) => [...prev, { text: '¿Cuál es el problema identificado?', sender: 'bot', buttons }]);
      return;
    }

    // Category entries
    if (message === 'issue_login') {
      setCurrentFlow('login_issue');
      setAwaitingOtherDescription(false);
      setMessages((prev) => [
        ...prev,
        { text: 'Elige una opción para ayudarte con el inicio de sesión:', sender: 'bot', buttons: [
          { title: 'Problemas con contraseña', payload: 'login_issue_password' },
          { title: 'Problemas con correo', payload: 'login_issue_email' },
          { title: 'Otros', payload: 'login_issue_other' }
        ] }
      ]);
      return;
    }
    if (message === 'issue_device') {
      setCurrentFlow('device_issue');
      setAwaitingOtherDescription(false);
      setMessages((prev) => [
        ...prev,
        { text: 'Selecciona el problema del dispositivo:', sender: 'bot', buttons: [
          { title: 'No enciende', payload: 'device_power' },
          { title: 'Pantalla/Video', payload: 'device_video' },
          { title: 'Periféricos/USB', payload: 'device_peripherals' },
          { title: 'Otros', payload: 'device_other' }
        ] }
      ]);
      return;
    }
    if (message === 'issue_notes') {
      setCurrentFlow('notes_issue');
      setAwaitingOtherDescription(false);
      setMessages((prev) => [
        ...prev,
        { text: '¿Qué ocurre con el cargado de notas?', sender: 'bot', buttons: [
          { title: 'No carga archivo', payload: 'notes_upload' },
          { title: 'Error de formato', payload: 'notes_format' },
          { title: 'Sin permisos', payload: 'notes_permissions' },
          { title: 'Otros', payload: 'notes_other' }
        ] }
      ]);
      return;
    }
    if (message === 'issue_other') {
      setCurrentFlow('other_issue');
      setAwaitingOtherDescription(true);
      setMessages((prev) => [...prev, { text: 'Describe brevemente tu problema para crear el ticket.', sender: 'bot' }]);
      return;
    }

    // Subflows
    if (currentFlow === 'login_issue') {
      if (message === 'login_issue_password') {
        await createTicket('Problemas de inicio de sesion', 'Problemas con contraseña');
        setCurrentFlow(null);
        return;
      }
      if (message === 'login_issue_email') {
        await createTicket('Problemas de inicio de sesion', 'Problemas con correo');
        setCurrentFlow(null);
        return;
      }
      if (message === 'login_issue_other') {
        setAwaitingOtherDescription(true);
        setMessages((prev) => [...prev, { text: 'Describe brevemente el problema de inicio de sesion para crear el ticket.', sender: 'bot' }]);
        return;
      }
      if (awaitingOtherDescription) {
        await createTicket('Problemas de inicio de sesion', message);
        setAwaitingOtherDescription(false);
        setCurrentFlow(null);
        return;
      }
    }

    if (currentFlow === 'device_issue') {
      if (message === 'device_power') {
        await createTicket('Problema de dispositivo', 'No enciende');
        setCurrentFlow(null);
        return;
      }
      if (message === 'device_video') {
        await createTicket('Problema de dispositivo', 'Pantalla/Video');
        setCurrentFlow(null);
        return;
      }
      if (message === 'device_peripherals') {
        await createTicket('Problema de dispositivo', 'Periféricos/USB');
        setCurrentFlow(null);
        return;
      }
      if (message === 'device_other') {
        setAwaitingOtherDescription(true);
        setMessages((prev) => [...prev, { text: 'Describe brevemente el problema del dispositivo para crear el ticket.', sender: 'bot' }]);
        return;
      }
      if (awaitingOtherDescription) {
        await createTicket('Problema de dispositivo', message);
        setAwaitingOtherDescription(false);
        setCurrentFlow(null);
        return;
      }
    }

    if (currentFlow === 'notes_issue') {
      if (message === 'notes_upload') {
        await createTicket('Problemas con cargado de notas', 'No carga archivo');
        setCurrentFlow(null);
        return;
      }
      if (message === 'notes_format') {
        await createTicket('Problemas con cargado de notas', 'Error de formato');
        setCurrentFlow(null);
        return;
      }
      if (message === 'notes_permissions') {
        await createTicket('Problemas con cargado de notas', 'Sin permisos');
        setCurrentFlow(null);
        return;
      }
      if (message === 'notes_other') {
        setAwaitingOtherDescription(true);
        setMessages((prev) => [...prev, { text: 'Describe el problema con el cargado de notas para crear el ticket.', sender: 'bot' }]);
        return;
      }
      if (awaitingOtherDescription) {
        await createTicket('Problemas con cargado de notas', message);
        setAwaitingOtherDescription(false);
        setCurrentFlow(null);
        return;
      }
    }

    if (currentFlow === 'other_issue') {
      if (awaitingOtherDescription) {
        await createTicket('Otro problema', message);
        setAwaitingOtherDescription(false);
        setCurrentFlow(null);
        return;
      }
    }

    // CTA confirmation
    if (message === 'cta_create' && awaitingCreateConfirm) {
      await createTicket(pendingTitle || 'Solicitud de soporte', pendingDescription || (displayText || message));
      setAwaitingCreateConfirm(false);
      setPendingTitle(null);
      setPendingDescription(null);
      return;
    }
    if (message === 'cta_skip' && awaitingCreateConfirm) {
      setMessages((prev) => [...prev, { text: 'De acuerdo, si necesitas, puedo crear el ticket más tarde.', sender: 'bot' }]);
      setAwaitingCreateConfirm(false);
      setPendingTitle(null);
      setPendingDescription(null);
      return;
    }

    // Fallback → Rasa
    setIsLoading(true);
    try {
      const res = await fetch(RASA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: sessionId, message })
      });
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const data = await res.json();
      const botReplies = Array.isArray(data)
        ? data.map((m) => ({ text: m.text || 'No entendí tu solicitud', sender: 'bot', buttons: m.buttons || null }))
        : [{ text: 'No entendí tu solicitud', sender: 'bot' }];
      setMessages((prev) => [...prev, ...botReplies]);

      // Tras una respuesta no-FAQ, ofrecer crear ticket
      const faqRegex = /(modalidad|admis|requisit|psa|libret|carrera|horario)/i;
      const isFaq = faqRegex.test(message) || botReplies.some((r) => faqRegex.test(r.text || ''));
      if (!currentFlow && !awaitingOtherDescription && !isFaq) {
        promptCreateTicket('Solicitud de soporte', displayText || message);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { text: 'No pude conectarme con el servicio. Intenta nuevamente más tarde.', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-widget ${isOpen ? 'open' : ''}`}>
      <button
        className={`chatbot-button ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
        aria-label={isOpen ? 'Cerrar asistente virtual' : 'Abrir asistente virtual'}
      >
        <span className="chatbot-button__icon" aria-hidden="true">
          {isOpen ? '✕' : '💬'}
        </span>
        <span className="chatbot-button__text">{isOpen ? 'Cerrar' : 'Hablar con EMI'}</span>
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header__info">
              <span className="chatbot-header__title">Asistente EMI</span>
              <span className="chatbot-header__subtitle">Soporte Cochabamba</span>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-message ${msg.sender}`}>
                {msg.text}
                {msg.buttons && (
                  <div className="chatbot-buttons">
                    {msg.buttons.map((btn, j) => (
                      <button key={j} onClick={() => handleSend(btn.payload || btn.title, btn.title)} disabled={isLoading}>
                        {btn.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message bot">
                <div className="typing-indicator"><span></span><span></span><span></span></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              disabled={isLoading}
            />
            <button onClick={() => !isLoading && handleSend()} disabled={isLoading || !newMessage.trim()}>
              {isLoading ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

