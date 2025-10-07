# Manual de Usuario – HelpDesk EMI

## Introducción
El sistema HelpDesk EMI centraliza la gestión de incidencias tecnológicas en tres módulos diferenciados por rol: Administrador, Técnico y Usuario Solicitante. Este manual describe cada vista, explica las funciones de sus botones y provee procedimientos paso a paso para trabajar de forma segura y consistente.

---

## Módulo Administrador
### 1. Pantalla principal (Dashboard)
Al ingresar como administrador se muestra un panel ejecutivo con cuatro tarjetas de métricas:
- **Usuarios registrados**: cantidad total de cuentas activas en la plataforma.
- **Tickets totales**: solicitudes acumuladas desde la puesta en marcha del sistema.
- **Tickets activos**: casos abiertos que requieren seguimiento.
- **Satisfacción**: promedio de calificaciones registradas por los solicitantes.

Bajo las tarjetas se presentan accesos rápidos a Configuración, Reportes, Lista de Tickets y Gestión de Usuarios, además de un resumen de actividad reciente para identificar novedades sin navegar a otras vistas.

### 2. Menú lateral
- 🏠 **Dashboard**: regresa a la vista principal con métricas y actividad.
- 🔧 **Configuración**: personaliza temas de color, idioma, densidad, accesos directos y parámetros de seguridad.
- 📊 **Reportes**: muestra el tablero analítico con indicadores, tendencias y exportación a PDF.
- 📨 **Lista de Tickets**: abre la tabla de tickets con filtros avanzados, búsqueda y acciones por fila.
- ➕ **Crear Tickets**: habilita el formulario para generar incidencias manuales.
- 👥 **Usuarios**: administra cuentas (crear, editar, eliminar, asignar roles).
- ❓ **Ayuda**: despliega el centro de ayuda con guías y recursos institucionales.

### 3. Guías paso a paso
#### 3.1 Supervisar y filtrar tickets
1. Abrir 📨 **Lista de Tickets**.
2. Usar los filtros de estado, rango de fechas y buscador para acotar resultados.
3. Pulsar **Actualizar** para refrescar la información.
4. Revisar columnas de técnico asignado, estado, fecha y calificación.

#### 3.2 Asignar un ticket a un técnico
1. Desde la lista, pulsar el botón **Asignar** (icono 👤➕) del ticket correspondiente.
2. Seleccionar un técnico disponible en el panel lateral que se despliega.
3. Confirmar con **Asignar**. El ticket se actualiza y la ventana se cierra.

#### 3.3 Editar o eliminar tickets
- **Editar**: pulsar el icono ✏️, ajustar título y descripción cuando se solicite y confirmar.
- **Eliminar**: pulsar el icono 🗑️ y confirmar en la ventana emergente.

#### 3.4 Crear un ticket manual
1. Ingresar a ➕ **Crear Tickets**.
2. Completar **Título** (obligatorio) y **Descripción** (detalles de la incidencia).
3. Pulsar **Crear ticket** para registrar; opcionalmente usar **Limpiar** para reiniciar campos.

#### 3.5 Generar reportes y exportar
1. Entrar en 📊 **Reportes**.
2. Revisar los bloques de resumen (totales, activos, resueltos, tiempo promedio de resolución).
3. Analizar la distribución por estado, la tendencia de los últimos 7 días y el promedio de satisfacción.
4. Consultar la tabla de tickets recientes.
5. Usar **Actualizar** para recargar datos o **Exportar (PDF)** para imprimir/guardar.

#### 3.6 Gestionar usuarios
1. Seleccionar 👥 **Usuarios**.
2. Completar el formulario con nombre, correo, contraseña y rol.
3. Presionar **Crear usuario** (o **Actualizar usuario** si está en modo edición).
4. Utilizar los botones ✏️/**Editar** y 🗑️/**Eliminar** sobre cada fila según corresponda.

#### 3.7 Ajustar configuración del panel
- Elegir temas (Automático, Claro, Oscuro) y densidad de la interfaz.
- Cambiar idioma, tamaño de fuente y accesos rápidos de menú.
- Activar controles de seguridad (verificación en dos pasos, alertas de inicio de sesión) y cerrar sesiones remotas.

### 4. Consejos de uso y buenas prácticas
- Actualice la lista de tickets antes de asignar para evitar duplicidades.
- Priorice los tickets **Sin asignar** y los estados críticos en los reportes.
- Revise periódicamente los accesos rápidos para mantener un menú coherente con su operación.
- Exporte reportes mensuales para respaldar indicadores institucionales.
- Cierre sesión al finalizar la jornada y revise las notificaciones de seguridad.

### 5. Ayuda
La vista ❓ **Ayuda** integra:
- Guía rápida de uso del panel administrativo.
- Accesos al manual completo y a la carpeta de recursos.
- Recomendaciones específicas para supervisar tickets, gestionar usuarios y mantener roles actualizados.
- Recordatorio del chatbot institucional como canal alterno.

---

## Módulo Técnico
### 1. Pantalla principal (Dashboard)
El tablero del técnico muestra un saludo personalizado, tarjetas con el número de tickets **Asignados**, **En progreso** y **Resueltos**, además de accesos rápidos para ir a la lista de casos y un listado de tickets recientes con estado y hora de creación.

### 2. Menú lateral
- 🏠 **Dashboard**: vista general con métricas personales y actividad reciente.
- 📨 **Mis Tickets**: abre la tabla filtrada con los tickets asignados al técnico.
- 🔧 **Configuración**: permite personalizar tema, idioma, densidad, notificaciones y seguridad (sesiones activas, autenticación adicional).

### 3. Guías paso a paso
#### 3.1 Revisar tickets asignados
1. Ingresar en 📨 **Mis Tickets**.
2. Utilizar filtros por estado (Pendientes, En progreso, Resueltos), rango de fechas y búsqueda libre.
3. Ordenar la tabla según fecha, título o estado para priorizar trabajo.

#### 3.2 Cambiar el estado de un ticket
1. Desde la tabla, identificar el ticket con la columna **Cambiar estado**.
2. Pulsar **Marcar en progreso** para iniciar la atención.
3. Al concluir, pulsar **Marcar resuelto**. El botón se deshabilita cuando el ticket ya está finalizado.

#### 3.3 Consultar tickets recientes desde el dashboard
1. En 🏠 **Dashboard**, revisar la tabla “Tickets Recientes”.
2. Utilizar el botón 👁️ para ampliar detalles (si está habilitado en su implementación).
3. Verificar el tiempo transcurrido y los estados para decidir prioridades.

#### 3.4 Ajustar preferencias personales
- Cambiar tema (Automático, Claro, Oscuro), idioma y tamaño de fuente.
- Activar/desactivar notificaciones de asignaciones, cambios de estado y recordatorios de SLA.
- Administrar accesos rápidos del menú y revisar/cerrar sesiones activas.

### 4. Consejos de uso y buenas prácticas
- Cambie el estado a “En progreso” al iniciar el trabajo para que el solicitante conozca el avance.
- Documente internamente hallazgos relevantes (cuando la versión instalada lo permita) antes de marcar como resuelto.
- Revise la sección de notificaciones al comenzar la jornada.
- Mantenga activas las alertas de inicio de sesión y finalice sesiones en dispositivos no utilizados.

### 5. Ayuda
La sección ❓ **Ayuda** muestra recomendaciones específicas para técnicos: uso de la vista “Tickets asignados”, orden correcto de estados (Esperando → En progreso → Resuelto) y recordatorio del chatbot para dudas frecuentes. También enlaza al manual general y a los recursos compartidos.

---

## Módulo Usuario Solicitante
### 1. Pantalla principal (Dashboard)
El solicitante encuentra un aviso de calificaciones pendientes, una bienvenida con la hora del último acceso y tres tarjetas con sus tickets **Totales**, **Activos** y **Resueltos**. También se lista la actividad reciente de sus últimas solicitudes para ubicar rápidamente el estado actual.

### 2. Menú lateral
- 🏠 **Dashboard**: resumen personal de incidencias y avisos de calificación.
- ➕ **Nuevo Ticket**: formulario para registrar una nueva solicitud.
- 📨 **Mis Tickets**: tabla con todos los tickets creados por el usuario, filtros y calificaciones.

### 3. Guías paso a paso
#### 3.1 Crear un nuevo ticket
1. Seleccionar ➕ **Nuevo Ticket**.
2. Completar **Título** (obligatorio) describiendo brevemente el problema.
3. Agregar **Descripción** con detalles: mensajes de error, pasos realizados, horario, etc.
4. Pulsar **Crear ticket**. El sistema confirmará con un mensaje de éxito y limpiará el formulario.

#### 3.2 Consultar y filtrar mis tickets
1. Entrar a 📨 **Mis Tickets**.
2. Filtrar por estado (Sin resolver, Resueltos), fechas o usar la búsqueda por palabras clave.
3. Revisar columnas de técnico asignado, estado, fecha y calificación.
4. Presionar **Actualizar** cuando necesite recargar información.

#### 3.3 Calificar la atención
1. Cuando un ticket esté marcado como **Resuelto**, aparecerán cinco botones de estrella en la columna **Calificación**.
2. Hacer clic en la cantidad de estrellas que represente su satisfacción (1-5).
3. La puntuación se guardará inmediatamente y podrá consultarse posteriormente.

### 4. Consejos de uso y buenas prácticas
- Describa con precisión la incidencia para acelerar la asignación.
- Utilice el buscador para recuperar tickets antiguos antes de crear uno nuevo.
- Atienda los recordatorios de calificación para mantener indicadores confiables.
- Consulte el chatbot institucional para guías rápidas antes de abrir un caso.
- Cierre sesión al terminar, especialmente en equipos compartidos.

### 5. Ayuda
En ❓ **Ayuda** el solicitante dispone de:
- Guía paso a paso para crear y seguir tickets.
- Acceso directo al manual institucional y al repositorio de imágenes de referencia.
- Sugerencias para detallar incidencias y calificar correctamente el servicio.
- Invitación a usar el chatbot como soporte inmediato.

---

## Recursos adicionales
- Manual descargable: `docs/MANUAL_USUARIO.md`.
- Carpeta sugerida para capturas: `docs/img/`.
- Chatbot de soporte: botón flotante “Chat” disponible en la aplicación web.
