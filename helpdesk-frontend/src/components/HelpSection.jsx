import React from 'react';
import './HelpSection.css';

const MODULE_MANUAL = {
  Administrador: {
    icon: '🏛️',
    title: 'Módulo Administrador',
    description:
      'Supervisa la operación completa del HelpDesk EMI: asigna tickets, controla configuraciones, genera reportes y gestiona usuarios.',
    sections: [
      {
        type: 'dashboard',
        order: '1',
        title: 'Pantalla principal (Dashboard)',
        description:
          'Al ingresar como administrador verás un panel ejecutivo con métricas clave y accesos rápidos a las áreas más utilizadas.',
        cards: [
          {
            title: 'Usuarios registrados',
            description: 'Cantidad total de cuentas activas en la plataforma.'
          },
          {
            title: 'Tickets totales',
            description: 'Solicitudes acumuladas desde la puesta en marcha del sistema.'
          },
          {
            title: 'Tickets activos',
            description: 'Casos abiertos que requieren seguimiento inmediato.'
          },
          {
            title: 'Satisfacción',
            description: 'Promedio de calificaciones registradas por los solicitantes.'
          }
        ],
        note:
          'Bajo las tarjetas se muestran accesos a Configuración, Reportes, Lista de Tickets y Gestión de Usuarios, junto con un resumen de actividad reciente.'
      },
      {
        type: 'menu',
        order: '2',
        title: 'Menú lateral',
        items: [
          { icon: '🏠', label: 'Dashboard', description: 'Regresa a la vista principal con métricas y actividad.' },
          {
            icon: '🔧',
            label: 'Configuración',
            description: 'Personaliza temas de color, idioma, densidad, accesos directos y parámetros de seguridad.'
          },
          { icon: '📊', label: 'Reportes', description: 'Tablero analítico con indicadores, tendencias y exportación a PDF.' },
          {
            icon: '📨',
            label: 'Lista de Tickets',
            description: 'Tabla completa de tickets con filtros avanzados, búsqueda y acciones por fila.'
          },
          { icon: '➕', label: 'Crear Tickets', description: 'Formulario para registrar incidencias manuales.' },
          { icon: '👥', label: 'Usuarios', description: 'Crea, edita, deshabilita y asigna roles a las cuentas.' },
          { icon: '❓', label: 'Ayuda', description: 'Centro con guías, recordatorios e ingreso al manual completo.' }
        ]
      },
      {
        type: 'guides',
        order: '3',
        title: 'Guías paso a paso',
        guides: [
          {
            subtitle: '3.1 Supervisar y filtrar tickets',
            steps: [
              'Abrir 📨 Lista de Tickets.',
              'Aplicar filtros por estado, fecha o buscar por palabras clave.',
              'Pulsar “Actualizar” para refrescar la información.',
              'Revisar columnas de técnico asignado, estado, fecha y calificación.'
            ]
          },
          {
            subtitle: '3.2 Asignar un ticket a un técnico',
            steps: [
              'Desde la tabla, pulsar el botón “Asignar” (icono 👤➕) del ticket correspondiente.',
              'Elegir un técnico disponible en el panel lateral.',
              'Confirmar con “Asignar” para notificar al técnico.'
            ]
          },
          {
            subtitle: '3.3 Editar o eliminar tickets',
            steps: [
              'Seleccionar ✏️ Editar para ajustar título y descripción y guardar cambios.',
              'Usar 🗑️ Eliminar únicamente cuando el ticket se canceló o se ingresó por error.'
            ]
          },
          {
            subtitle: '3.4 Crear un ticket manual',
            steps: [
              'Ingresar a ➕ Crear Tickets.',
              'Completar título y descripción detallada de la incidencia.',
              'Pulsar “Crear ticket”. Opcionalmente usar “Limpiar” para reiniciar campos.'
            ]
          },
          {
            subtitle: '3.5 Generar reportes y exportar',
            steps: [
              'Abrir 📊 Reportes y revisar bloques de totales, activos, resueltos y tiempo promedio.',
              'Analizar las gráficas de distribución, tendencia y satisfacción.',
              'Usar “Actualizar” para refrescar datos o “Exportar (PDF)” para compartirlos.'
            ]
          },
          {
            subtitle: '3.6 Gestionar usuarios',
            steps: [
              'Ingresar a 👥 Usuarios para crear o editar cuentas.',
              'Asignar el rol correcto (Solicitante, Técnico o Administrador).',
              'Actualizar datos de contacto o restablecer contraseñas según se requiera.'
            ]
          },
          {
            subtitle: '3.7 Ajustar configuración del panel',
            steps: [
              'Configurar tema, densidad, idioma y tamaño de fuente en 🔧 Configuración.',
              'Activar verificaciones de seguridad y cerrar sesiones remotas cuando sea necesario.'
            ]
          }
        ]
      },
      {
        type: 'bestPractices',
        order: '4',
        title: 'Consejos de uso y buenas prácticas',
        items: [
          'Actualiza la lista de tickets antes de asignar para evitar duplicidades.',
          'Prioriza los tickets “Sin asignar” y los estados críticos en los reportes.',
          'Revisa y ajusta los accesos rápidos para mantener un menú alineado a tu operación.',
          'Exporta reportes mensuales como respaldo institucional.',
          'Cierra sesión al finalizar la jornada y revisa alertas de seguridad.'
        ]
      },
      {
        type: 'helpPanel',
        order: '5',
        title: 'Centro de Ayuda (vista ❓ Ayuda)',
        panelTitle: '🛎️ Panel de ayuda del Administrador',
        areas: [
          {
            icon: '📂',
            label: 'Recursos',
            description: 'Manual descargable, plantillas institucionales y acceso directo al chatbot EMI.'
          },
          {
            icon: '⚙️',
            label: 'Operación diaria',
            description: 'Checklist con tickets nuevos, asignaciones pendientes y alertas de seguridad.'
          },
          {
            icon: '🧭',
            label: 'Flujos guiados',
            description: 'Tarjetas con procesos frecuentes: crear usuario, reasignar ticket, generar reporte y ajustar catálogos.'
          },
          {
            icon: '🛡️',
            label: 'Seguridad y configuración',
            description: 'Accesos para cambiar contraseña, activar MFA y cerrar sesiones remotas.'
          }
        ],
        highlightsTitle: 'Buenas prácticas resaltadas',
        highlights: [
          'Revisa Operación diaria antes de asignar tickets para evitar duplicidades.',
          'Utiliza Flujos guiados para capacitar nuevo personal y homologar procedimientos.',
          'Descarga reportes desde Recursos al cierre de mes y respáldalos en el repositorio institucional.',
          'Desde Seguridad y configuración cierra sesiones en dispositivos compartidos y atiende alertas críticas.'
        ]
      }
    ]
  },
  Tecnico: {
    icon: '🧰',
    title: 'Módulo Técnico',
    description:
      'Administra tus tickets asignados, avanza estados, documenta hallazgos y conserva indicadores de servicio al día.',
    sections: [
      {
        type: 'dashboard',
        order: '1',
        title: 'Pantalla principal (Dashboard)',
        description:
          'El tablero muestra un saludo, tarjetas con tickets asignados, en progreso y resueltos, además de accesos rápidos y actividad reciente.',
        cards: [
          {
            title: 'Asignados',
            description: 'Cantidad de casos que requieren atención inmediata.'
          },
          {
            title: 'En progreso',
            description: 'Tickets que ya están en tratamiento y deben actualizarse con frecuencia.'
          },
          {
            title: 'Resueltos',
            description: 'Historial de incidencias finalizadas para seguimiento de desempeño.'
          }
        ],
        note:
          'La sección de tickets recientes detalla estado y hora de creación para ayudarte a planificar prioridades.'
      },
      {
        type: 'menu',
        order: '2',
        title: 'Menú lateral',
        items: [
          { icon: '🏠', label: 'Dashboard', description: 'Vista general con métricas personales y actividad reciente.' },
          {
            icon: '📨',
            label: 'Mis Tickets',
            description: 'Tabla filtrada con todos los casos asignados, incluyendo buscador y filtros.'
          },
          {
            icon: '🔧',
            label: 'Configuración',
            description: 'Preferencias de tema, idioma, densidad, notificaciones y seguridad.'
          }
        ]
      },
      {
        type: 'guides',
        order: '3',
        title: 'Guías paso a paso',
        guides: [
          {
            subtitle: '3.1 Revisar tickets asignados',
            steps: [
              'Entrar en 📨 Mis Tickets.',
              'Filtrar por estado (Pendientes, En progreso, Resueltos), fecha o búsqueda libre.',
              'Ordenar la tabla por fecha, título o estado para priorizar el trabajo.'
            ]
          },
          {
            subtitle: '3.2 Cambiar el estado de un ticket',
            steps: [
              'Identificar el ticket y usar el botón “Marcar en progreso” al iniciar la atención.',
              'Registrar notas o comentarios técnicos cuando la implementación lo permita.',
              'Pulsar “Marcar resuelto” al concluir para notificar al solicitante.'
            ]
          },
          {
            subtitle: '3.3 Consultar tickets recientes desde el dashboard',
            steps: [
              'En 🏠 Dashboard, revisar la tabla “Tickets Recientes”.',
              'Utilizar el botón 👁️ para ampliar detalles si está disponible.',
              'Verificar tiempos transcurridos y estados para decidir prioridades.'
            ]
          },
          {
            subtitle: '3.4 Ajustar preferencias personales',
            steps: [
              'En 🔧 Configuración elige tema (Automático, Claro, Oscuro), idioma y tamaño de fuente.',
              'Activa o desactiva notificaciones de asignaciones, cambios de estado y recordatorios de SLA.',
              'Revisa y cierra sesiones activas en dispositivos que ya no utilices.'
            ]
          }
        ]
      },
      {
        type: 'bestPractices',
        order: '4',
        title: 'Consejos de uso y buenas prácticas',
        items: [
          'Cambia el estado a “En progreso” al iniciar el trabajo para informar al solicitante.',
          'Documenta hallazgos y evidencia antes de marcar un ticket como resuelto.',
          'Revisa notificaciones y alertas al comenzar la jornada.',
          'Mantén activas las alertas de inicio de sesión y cierra sesiones no utilizadas.'
        ]
      },
      {
        type: 'helpPanel',
        order: '5',
        title: 'Centro de Ayuda (vista ❓ Ayuda)',
        panelTitle: '🧰 Panel de ayuda del Técnico',
        areas: [
          {
            icon: '🧾',
            label: 'Checklist operativo',
            description: 'Ruta visual Revisión → En progreso → Resuelto → Calificación, con recordatorio de documentar hallazgos.'
          },
          {
            icon: '🚨',
            label: 'Alertas del día',
            description: 'Tarjetas con tickets críticos, SLA próximos a vencer y reasignaciones recientes.'
          },
          {
            icon: '🗒️',
            label: 'Guías rápidas',
            description: 'Pasos resumidos para actualizar estados, adjuntar evidencias y coordinar con soporte de segundo nivel.'
          },
          {
            icon: '🤖',
            label: 'Chatbot EMI Técnico',
            description: 'Consejos de diagnóstico, escalamientos y artículos de la base de conocimiento.'
          }
        ],
        highlightsTitle: 'Buenas prácticas resaltadas',
        highlights: [
          'Actualiza el estado desde Checklist operativo para informar al solicitante en tiempo real.',
          'Prioriza las Alertas del día para cumplir con los SLA comprometidos.',
          'Consulta Guías rápidas al documentar cambios y mantener evidencias adjuntas.',
          'Utiliza el Chatbot EMI Técnico para acceder a procedimientos especializados o coordinar soporte remoto.'
        ]
      }
    ]
  },
  Solicitante: {
    icon: '💡',
    title: 'Módulo Usuario Solicitante',
    description:
      'Registra incidencias, da seguimiento a tus solicitudes y califica la atención recibida de forma rápida y ordenada.',
    sections: [
      {
        type: 'dashboard',
        order: '1',
        title: 'Pantalla principal (Dashboard)',
        description:
          'La vista principal muestra recordatorios de calificación, la hora de tu último acceso y tarjetas con el resumen de tickets.',
        cards: [
          {
            title: 'Tickets totales',
            description: 'Cantidad acumulada de solicitudes que has registrado.'
          },
          {
            title: 'Tickets activos',
            description: 'Casos que aún están abiertos y requieren seguimiento.'
          },
          {
            title: 'Tickets resueltos',
            description: 'Incidencias finalizadas disponibles para consultar historial y calificar.'
          }
        ],
        note:
          'La actividad reciente lista los últimos movimientos para que ubiques rápidamente el estado de cada solicitud.'
      },
      {
        type: 'menu',
        order: '2',
        title: 'Menú lateral',
        items: [
          { icon: '🏠', label: 'Dashboard', description: 'Resumen personal de incidencias y avisos de calificación.' },
          { icon: '➕', label: 'Nuevo Ticket', description: 'Formulario para registrar una nueva solicitud con detalles y evidencias.' },
          {
            icon: '📨',
            label: 'Mis Tickets',
            description: 'Tabla con todas tus solicitudes, filtros por estado y acceso a la calificación de servicio.'
          }
        ]
      },
      {
        type: 'guides',
        order: '3',
        title: 'Guías paso a paso',
        guides: [
          {
            subtitle: '3.1 Crear un nuevo ticket',
            steps: [
              'Seleccionar ➕ Nuevo Ticket.',
              'Completar el título describiendo brevemente la incidencia.',
              'Agregar una descripción detallada con mensajes de error, pasos realizados y horarios.',
              'Pulsar “Crear ticket”. El sistema confirmará y limpiará el formulario.'
            ]
          },
          {
            subtitle: '3.2 Consultar y filtrar mis tickets',
            steps: [
              'Entrar a 📨 Mis Tickets.',
              'Filtrar por estado (Sin resolver, Resueltos), rango de fechas o buscar por palabras clave.',
              'Revisar técnico asignado, estado, fecha y calificación antes de abrir un nuevo caso.',
              'Presionar “Actualizar” para recargar información.'
            ]
          },
          {
            subtitle: '3.3 Calificar la atención',
            steps: [
              'Cuando un ticket esté resuelto aparecerán cinco estrellas en la columna Calificación.',
              'Selecciona el número de estrellas que represente tu satisfacción (1-5).',
              'La puntuación se guarda al instante y queda disponible para consulta futura.'
            ]
          }
        ]
      },
      {
        type: 'bestPractices',
        order: '4',
        title: 'Consejos de uso y buenas prácticas',
        items: [
          'Describe la incidencia con precisión para acelerar la asignación de un técnico.',
          'Usa el buscador antes de crear un ticket nuevo y evita duplicar solicitudes.',
          'Responde a los recordatorios de calificación para mantener indicadores confiables.',
          'Consulta el chatbot institucional para guías rápidas antes de abrir un caso.',
          'Cierra sesión al terminar, especialmente si utilizas equipos compartidos.'
        ]
      },
      {
        type: 'helpPanel',
        order: '5',
        title: 'Centro de Ayuda (vista ❓ Ayuda)',
        panelTitle: '💡 Panel de ayuda del Solicitante',
        areas: [
          {
            icon: '🚀',
            label: 'Primeros pasos',
            description: 'Video guiado, ejemplo de ticket bien redactado y acceso directo a Crear ticket.'
          },
          {
            icon: '📬',
            label: 'Seguimiento y avisos',
            description: 'Indicaciones para leer estados, activar recordatorios de correo y filtrar por fecha o prioridad.'
          },
          {
            icon: '⭐',
            label: 'Califica el servicio',
            description: 'Explicación de las estrellas y recordatorio institucional para compartir comentarios.'
          },
          {
            icon: '🤖',
            label: 'Chatbot EMI Solicitante',
            description: 'Sugerencias de autodiagnóstico, horarios extendidos y enlaces a tutoriales básicos.'
          }
        ],
        highlightsTitle: 'Consejos visibles',
        highlights: [
          'Completa los campos obligatorios y valida correo/teléfono en Primeros pasos antes de enviar.',
          'Consulta Seguimiento y avisos cuando recibas notificaciones para conocer cambios de estado.',
          'Califica el servicio apenas se marque un ticket como resuelto para actualizar el indicador de satisfacción.',
          'Recurre al Chatbot EMI Solicitante para resolver dudas frecuentes sin abrir casos repetitivos.'
        ]
      }
    ]
  }
};

function SectionHeader({ order, title, description }) {
  return (
    <header className="manual-section__header">
      <span className="manual-section__badge">{order}</span>
      <div>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
    </header>
  );
}

function DashboardSection({ section }) {
  return (
    <section className="manual-section">
      <SectionHeader order={section.order} title={section.title} description={section.description} />
      <div className="manual-card-grid">
        {section.cards.map((card) => (
          <div key={card.title} className="manual-card">
            <h4>{card.title}</h4>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
      {section.note && <p className="manual-note">{section.note}</p>}
    </section>
  );
}

function MenuSection({ section }) {
  return (
    <section className="manual-section">
      <SectionHeader order={section.order} title={section.title} />
      <ul className="manual-menu">
        {section.items.map((item) => (
          <li key={item.label}>
            <span className="manual-menu__icon">{item.icon}</span>
            <div>
              <h4>{item.label}</h4>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function GuidesSection({ section }) {
  return (
    <section className="manual-section">
      <SectionHeader order={section.order} title={section.title} />
      <div className="manual-guide-grid">
        {section.guides.map((guide) => (
          <article key={guide.subtitle} className="manual-guide">
            <h4>{guide.subtitle}</h4>
            <ol>
              {guide.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </section>
  );
}

function BestPracticesSection({ section }) {
  return (
    <section className="manual-section">
      <SectionHeader order={section.order} title={section.title} />
      <ul className="manual-list">
        {section.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function HelpPanelSection({ section }) {
  return (
    <section className="manual-section">
      <SectionHeader order={section.order} title={section.title} />
      <div className="manual-help-panel">
        <h4>{section.panelTitle}</h4>
        <table>
          <thead>
            <tr>
              <th>Área</th>
              <th>¿Qué incluye?</th>
            </tr>
          </thead>
          <tbody>
            {section.areas.map((area) => (
              <tr key={area.label}>
                <td>
                  <span className="manual-table-icon">{area.icon}</span>
                  {area.label}
                </td>
                <td>{area.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="manual-help-panel__notes">
          <h5>{section.highlightsTitle}</h5>
          <ol>
            {section.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ManualModule({ moduleKey, data }) {
  return (
    <article className="manual-module" id={`manual-${moduleKey.toLowerCase()}`}>
      <header className="manual-module__header">
        <span className="manual-module__icon" aria-hidden>{data.icon}</span>
        <div>
          <h2>{data.title}</h2>
          <p>{data.description}</p>
        </div>
      </header>

      {data.sections.map((section) => {
        switch (section.type) {
          case 'dashboard':
            return <DashboardSection key={section.title} section={section} />;
          case 'menu':
            return <MenuSection key={section.title} section={section} />;
          case 'guides':
            return <GuidesSection key={section.title} section={section} />;
          case 'bestPractices':
            return <BestPracticesSection key={section.title} section={section} />;
          case 'helpPanel':
            return <HelpPanelSection key={section.title} section={section} />;
          default:
            return null;
        }
      })}
    </article>
  );
}

export default function HelpSection({ role = 'Solicitante' }) {
  const normalizedRole = role === 'Administrador' ? 'Administrador' : role === 'Tecnico' ? 'Tecnico' : 'Solicitante';
  const modulesToRender =
    normalizedRole === 'Administrador' ? ['Administrador', 'Tecnico', 'Solicitante'] : [normalizedRole];

  return (
    <div className="help-section">
      <header className="help-section__intro">
        <h1>Manual interactivo – HelpDesk EMI</h1>
        <p>
          Consulta procedimientos oficiales, menús y buenas prácticas según tu rol. El Administrador puede visualizar los tres módulos para
          capacitar al personal y garantizar la correcta operación del servicio institucional.
        </p>
        <div className="help-section__links">
          <span>Recursos rápidos</span>
          <ul>
            <li>
              📘 Manual descargable: <code>docs/MANUAL_USUARIO.md</code>
            </li>
            <li>🗂️ Carpeta de capturas sugeridas: <code>docs/img/</code></li>
            <li>🤖 Chatbot EMI: botón flotante “Chat” disponible en toda la aplicación.</li>
          </ul>
        </div>
      </header>

      <div className="manual-modules">
        {modulesToRender.map((moduleKey) => (
          <ManualModule key={moduleKey} moduleKey={moduleKey} data={MODULE_MANUAL[moduleKey]} />
        ))}
      </div>
    </div>
  );
}
