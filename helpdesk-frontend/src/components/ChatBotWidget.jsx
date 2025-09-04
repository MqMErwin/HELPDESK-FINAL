import React, { useState, useEffect, useRef } from 'react';
import './ChatBotWidget.css';

export default function ChatBotWidget({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [messages, setMessages] = useState([
    {
      text: "¡Hola! Soy el asistente de soporte de la EMI Cochabamba.",
      sender: "bot"
    },
    {
      text: "¿Eres estudiante, docente o personal administrativo?",
      sender: "bot",
      buttons: [
        { title: "Estudiante", payload: "Estudiante" },
        { title: "Docente", payload: "Docente" },
        { title: "Administrativo", payload: "Administrativo" }
      ]
    },
    {
      text: "También puedo ayudarte con preguntas frecuentes:",
      sender: "bot",
      buttons: [
        { title: "Modalidades de admisión", payload: "Cuáles son las modalidades de Admisión a la EMI?" },
        { title: "Requisitos", payload: "Cuáles son los requisitos para formar parte de la EMI?" },
        { title: "Prueba PSA", payload: "Qué es la prueba de suficiencia académica PSA?" },
        { title: "Libreta militar", payload: "Cómo obtener la libreta de Servicio Militar?" },
        { title: "Carreras", payload: "Cuáles son las carreras con las que cuenta la EMI?" },
        { title: "Horarios", payload: "Cuáles son los horarios de atención?" }
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() =>
    userId ? String(userId) : 'guest_' + Math.random().toString(36).substr(2, 9)
  );
  const messagesEndRef = useRef(null);

  const RASA_ENDPOINT = 'http://localhost:5005/webhooks/rest/webhook';

  const getProblemButtons = (role) => {
    if (role === 'Estudiante') {
      return [
        { title: 'Problemas de inicio de sesión', payload: 'Soy estudiante y tengo problemas de inicio de sesión' },
        { title: 'Otros', payload: 'Soy estudiante y tengo otro problema' }
      ];
    }
    if (role === 'Docente') {
      return [
        { title: 'Inicio de sesión', payload: 'Soy docente y tengo problemas de inicio de sesión' },
        { title: 'Dispositivo', payload: 'Soy docente con un dispositivo con problemas' },
        { title: 'Cargado de notas', payload: 'Soy docente y tengo problemas con el cargado de notas' },
        { title: 'Otros', payload: 'Soy docente y tengo otro problema' }
      ];
    }
    return [
      { title: 'Inicio de sesión', payload: 'Soy personal administrativo y tengo problemas de inicio de sesión' },
      { title: 'Otros', payload: 'Soy personal administrativo y tengo otro problema' }
    ];
  };

  // Cargar mensajes guardados al iniciar
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Guardar mensajes cuando cambian
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleSend = async (textToSend = null, displayText = null) => {
    const message = textToSend || newMessage.trim();
    if (!message) return;

    // Agregar mensaje de usuario
    const userMessage = { text: displayText || message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setNewMessage('');

    // Manejo de selección de rol
    if (["Estudiante", "Docente", "Administrativo"].includes(message)) {
      setSelectedRole(message);
      const buttons = getProblemButtons(message);
      setMessages(prev => [...prev, { text: '¿Cuál es el problema identificado?', sender: 'bot', buttons }]);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Enviando a Rasa:', { sender: sessionId, message }); // Debug

      const response = await fetch(RASA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: sessionId,
          message: message
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta de Rasa:', data); // Debug

      if (!Array.isArray(data)) {
        throw new Error('Formato de respuesta inválido');
      }

      // Procesar respuesta
      const botReplies = data.map(msg => ({
        text: msg.text || 'No entendí tu solicitud',
        sender: 'bot',
        buttons: msg.buttons || null
      }));

      setMessages(prev => [...prev, ...botReplies]);
    } catch (error) {
      console.error('Error completo:', error);
      setMessages(prev => [...prev, {
        text: '⚠️ No pude conectarme con el servicio. Intenta nuevamente más tarde.',
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-widget ${isOpen ? 'open' : ''}`}>
      <button className="chatbot-button" onClick={handleToggle}>
        {isOpen ? '✖' : '🤖  '}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>CABOT</span>
            <button onClick={handleToggle}>✖</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${msg.sender}`}
              >
                {msg.text}
                {msg.buttons && (
                  <div className="chatbot-buttons">
                    {msg.buttons.map((btn, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(btn.payload || btn.title, btn.title)}
                        disabled={isLoading}
                      >
                        {btn.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
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
            <button 
              onClick={() => !isLoading && handleSend()}
              disabled={isLoading || !newMessage.trim()}
            >
              {isLoading ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}