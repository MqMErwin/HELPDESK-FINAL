import React from 'react';
import './HelpSection.css';

const GENERAL_TOPICS = [
  {
    title: 'Guía rápida',
    description:
      'Sigue estos pasos si recién ingresas: inicia sesión, revisa la bandeja principal y utiliza el chatbot si necesitas ayuda inmediata.',
    steps: [
      'Inicia sesión con tus credenciales asignadas.',
      'Desde el menú lateral elige la sección que necesitas (Mis tickets, Nuevo ticket, etc.).',
      'Usa el buscador y los filtros para ubicar tickets rápidamente.',
      'Consulta el chatbot (botón "Chat") para preguntas frecuentes y creación guiada de tickets.'
    ]
  },
  {
    title: 'Manual completo',
    description:
      'Encuentra el manual con capturas y explicación detallada en docs/MANUAL_USUARIO.md. Puedes convertirlo a PDF o imprimirlo.',
    steps: [
      'Abrir el archivo docs/MANUAL_USUARIO.md dentro del proyecto.',
      'Completar las capturas indicadas en docs/img/* (o solicitar al administrador que las añada).',
      'Compartir el manual actualizado con los usuarios finales (PDF o enlace interno).'
    ]
  },
  {
    title: 'Sugerencias generales',
    description: 'Recomendaciones transversales para todos los roles.',
    steps: [
      'Mantén tus datos de contacto actualizados para recibir notificaciones de tickets.',
      'Califica la atención al cerrar un ticket para mejorar el servicio.',
      'Si detectas un error en el sistema, crea un ticket etiquetado como "Incidencia" para que soporte técnico lo atienda.'
    ]
  }
];

const ROLE_TOPICS = {
  Solicitante: [
    {
      title: 'Crear y seguir tus tickets',
      description:
        'Registra incidencias desde "Nuevo ticket" o mediante el chatbot. Haz seguimiento en "Mis tickets".',
      steps: [
        'Completa título y descripción con el mayor detalle posible.',
        'Adjunta información relevante si el formulario lo permite.',
        'Utiliza los filtros por fecha y estado para encontrar tickets antiguos.',
        'Cuando el ticket se resuelva, califica la atención desde la columna "Calificación".'
      ]
    }
  ],
  Tecnico: [
    {
      title: 'Gestionar tickets asignados',
      description:
        'Solo puedes avanzar un ticket a "En Progreso" y luego a "Resuelto". Planifica tu trabajo con la vista "Tickets asignados".',
      steps: [
        'Usa el botón "Marcar en progreso" cuando comiences a trabajar.',
        'Agrega notas internas o comentarios si la funcionalidad está disponible.',
        'Al terminar, presiona "Marcar resuelto" para notificar al solicitante.',
        'Monitorea la retroalimentación recibida para mejorar el servicio.'
      ]
    }
  ],
  Administrador: [
    {
      title: 'Supervisar y asignar tickets',
      description:
        'Desde la sección "Tickets" puedes asignar incidencias, editar información y monitorear el estado del flujo completo.',
      steps: [
        'Filtra por estado "Sin asignar" para atender nuevas solicitudes.',
        'Asigna un técnico disponible desde el panel lateral (botón "Asignar").',
        'Utiliza la búsqueda por #ID, título, solicitante o técnico para búsquedas avanzadas.',
        'Genera reportes y exporta información si tu implementación lo permite.'
      ]
    },
    {
      title: 'Gestión de usuarios y configuración',
      description:
        'La sección "Usuarios" (si está habilitada) te permite crear, editar o deshabilitar cuentas.',
      steps: [
        'Verifica que cada usuario tenga el rol correcto (Solicitante, Técnico, Administrador).',
        'Actualiza datos de contacto y restablece contraseñas cuando sea necesario.',
        'Revisa periódicamente los dashboards de reportes para detectar cuellos de botella.'
      ]
    }
  ]
};

function HelpTopic({ title, description, steps }) {
  return (
    <section className="help-topic">
      <header>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </header>
      {steps && steps.length > 0 && (
        <ol>
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default function HelpSection({ role = 'Solicitante' }) {
  const roleSpecific = ROLE_TOPICS[role] || [];

  return (
    <div className="help-section">
      <div className="help-section__intro">
        <h2>Centro de ayuda</h2>
        <p>
          Aquí encontrarás atajos, recomendaciones y acceso al manual para aprovechar el sistema de soporte.
          Si necesitas asistencia inmediata, inicia el chatbot o contacta al administrador.
        </p>
        <div className="help-section__links">
          <span>Recursos:</span>
          <ul>
            <li>
              Manual descargable: <code>docs/MANUAL_USUARIO.md</code>
            </li>
            <li>
              Carpeta de capturas sugeridas: <code>docs/img/</code>
            </li>
            <li>
              Chatbot de soporte (botón "Chat" en la esquina inferior derecha).
            </li>
          </ul>
        </div>
      </div>

      <div className="help-section__grid">
        {GENERAL_TOPICS.map((topic) => (
          <HelpTopic key={topic.title} {...topic} />
        ))}
        {roleSpecific.map((topic) => (
          <HelpTopic key={topic.title} {...topic} />
        ))}
      </div>
    </div>
  );
}
