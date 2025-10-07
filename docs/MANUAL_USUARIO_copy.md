# Manual de Usuario – HelpDesk EMI Cochabamba

## Índice
- [Introducción](#introducción)
- [Acceso e Inicio de Sesión](#acceso-e-inicio-de-sesión)
- [Chatbot de Soporte](#chatbot-de-soporte)
- [Rol Solicitante](#rol-solicitante)
- [Rol Técnico](#rol-técnico)
- [Rol Administrador](#rol-administrador)
- [Sección de Ayuda](#sección-de-ayuda)
- [Glosario](#glosario)
- [Preguntas Frecuentes](#preguntas-frecuentes)

## Introducción
El sistema HelpDesk EMI Cochabamba permite registrar incidencias (tickets), asignarlas a técnicos y hacer seguimiento hasta su resolución. Incluye filtros por estado, rango de fechas, buscador, calificación del servicio y un chatbot que guía a los usuarios.

> **Nota:** Las capturas de pantalla sugeridas deben guardarse en docs/img/ con los nombres indicados. Puedes usar cualquier herramienta (Snipping Tool, Lightshot, etc.) y, si lo deseas, agregar números o resaltes para indicar zonas clave.

## Acceso e Inicio de Sesión
![Pantalla de Login](img/01-login.png)

1. **Usuario/Correo:** escribe tus credenciales registradas.
2. **Contraseña:** introduce la clave asociada a tu cuenta.
3. **Botón “Ingresar”:** valida credenciales y redirige al panel correspondiente.
4. **¿Olvidaste la contraseña / registro?** (si aplica): sigue los pasos mostrados en pantalla.

**Flujo básico**
- Inicia sesión con tu rol (Solicitante, Técnico o Administrador).
- El sistema te llevará al dashboard correspondiente.

## Chatbot de Soporte
![Chatbot](img/02-chatbot.png)

1. **Botón flotante “Chat/Cerrar”:** abre o cierra el asistente.
2. **Encabezado “Asistente EMI – Soporte Cochabamba”:** confirma que estás en el asistente oficial.
3. **Mensaje inicial:** solicita tu rol (Estudiante, Docente, Administrativo).
4. **Botones de rol:** selecciona el que corresponda para personalizar la conversación.
5. **Campo de texto y botón “Enviar”:** escribe tus consultas; el bot puede crear tickets guiados.

## Rol Solicitante
### Listado y seguimiento de tickets
![Solicitante – Listado](img/03-solicitante-listado.png)

1. **Actualizar:** recarga la lista de tickets.
2. **Filtro de estado:** filtra por Resueltos, Sin resolver, etc.
3. **Rango de fechas:** define un periodo para listar tickets.
4. **Buscador:** encuentra tickets por título, técnico, estado o fecha.
5. **Tabla:** muestra detalle, técnico asignado y estado actual.

### Calificar la atención
![Calificación](img/04-calificacion.png)

- Al cerrar un ticket, selecciona de 1 a 5 estrellas para valorar el servicio.
- Esta retroalimentación ayuda al equipo de soporte a mejorar.

## Rol Técnico
### Tickets asignados y flujo de trabajo
![Técnico – Listado](img/05-tecnico-listado.png)

1. **Filtro de estado:** revisa pendientes, en progreso o resueltos.
2. **Botón “Marcar en progreso”:** disponible cuando el ticket está Esperando/Asignado.
3. **Botón “Marcar resuelto”:** disponible después de marcar en progreso.
4. **Información clave:** título, descripción, solicitante y fecha.

> **Importante:** Una vez marcado como Resuelto, el botón queda deshabilitado y el ticket no puede retroceder de estado.

## Rol Administrador
### Gestión de tickets
![Administrador – Tickets](img/06-admin-listado.png)

1. **Filtros globales:** estado, fechas, buscador.
2. **Acciones por fila:** asignar técnico, editar o eliminar.
3. **Resumen de estado:** consulta el avance general y calificaciones recibidas.

### Panel de asignación de técnicos
![Asignar Técnico](img/07-asignacion.png)

1. **Listado de técnicos disponibles:** ordenado alfabéticamente.
2. **Botón “Asignar”:** confirma la asignación.
3. **Cerrar:** cancela el proceso sin cambios.

### Gestión de usuarios
![Gestión de Usuarios](img/08-usuarios.png)

- Crea, edita o deshabilita cuentas de solicitantes, técnicos y administradores.
- Verifica roles correctos y datos de contacto actualizados.

## Sección de Ayuda
![Sección de Ayuda](img/09-ayuda.png)

La opción **Ayuda** en el menú lateral muestra:
- Guía rápida para nuevos usuarios.
- Acceso directo al manual (docs/MANUAL_USUARIO.md).
- Recomendaciones específicas según el rol con el que iniciaste sesión.
- Recordatorio del chatbot como canal de apoyo inmediato.

## Glosario
- **Ticket:** solicitud de soporte o incidencia registrada.
- **Estados:** Esperando, Asignado, En Progreso, Resuelto.
- **Calificación:** valoración (1 a 5) realizada por el solicitante al cerrar un ticket.
- **Rango de fechas:** filtro por fecha de creación.

## Preguntas Frecuentes
1. **No encuentro mi ticket.**
   - Verifica el rango de fechas y utiliza el buscador por título o #ID.
2. **No puedo cambiar el estado como técnico.**
   - Solo puedes avanzar de Esperando/Asignado ? En Progreso ? Resuelto. Si el botón está deshabilitado, revisa si ya está resuelto.
3. **El chatbot no responde.**
   - Comprueba tu conexión, recarga la página o contacta al administrador.
4. **¿Dónde está el manual actualizado?**
   - En este proyecto: docs/MANUAL_USUARIO.md. Agrega tus capturas en docs/img/ y compártelo como PDF si es necesario.

---

> **Actualización de capturas**
>
> - 01-login.png
> - 02-chatbot.png
> - 03-solicitante-listado.png
> - 04-calificacion.png
> - 05-tecnico-listado.png
> - 06-admin-listado.png
> - 07-asignacion.png
> - 08-usuarios.png
> - 09-ayuda.png
>
> Si necesitas ayuda para generar o editar las imágenes, puedes solicitarlo en el equipo de soporte o capturarlas directamente en la aplicación.

