using HelpDeskAPI.Data;
using HelpDeskAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDeskAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatMessagesController : ControllerBase
    {
        private readonly HelpDeskContext _context;

        public ChatMessagesController(HelpDeskContext context)
        {
            _context = context;
        }

        // GET: api/chatmessages/byticket/5
        [HttpGet("byticket/{ticketId}")]
        public async Task<ActionResult<IEnumerable<ChatMessage>>> GetMessagesByTicket(int ticketId)
        {
            var messages = await _context.ChatMessages
                .Where(m => m.TicketId == ticketId)
                .Include(m => m.Usuario)
                .OrderBy(m => m.Fecha)
                .ToListAsync();

            return messages;
        }

        // POST: api/chatmessages
        [HttpPost]
        public async Task<ActionResult<ChatMessage>> PostMessage(ChatMessage message)
        {
            message.Fecha = DateTime.UtcNow;

            if (message.TicketId == 0)
            {
                var ticket = new Ticket
                {
                    Titulo = message.Mensaje.Length > 50 ? message.Mensaje.Substring(0, 50) : message.Mensaje,
                    Descripcion = message.Mensaje,
                    UsuarioId = message.UsuarioId,
                    Estado = TicketEstado.Esperando,
                    FechaCreacion = DateTime.UtcNow
                };

                // Intento de autoasignación (si hay técnicos disponibles)
                try
                {
                    var technicians = await _context.Users
                        .Where(u => u.Rol == "Tecnico")
                        .Select(u => new { u.Id })
                        .ToListAsync();

                    if (technicians.Count > 0)
                    {
                        var loads = await _context.Tickets
                            .Where(t => t.TecnicoId != null && t.Estado != TicketEstado.Resuelto)
                            .GroupBy(t => t.TecnicoId)
                            .Select(g => new { TecnicoId = g.Key!.Value, Count = g.Count() })
                            .ToListAsync();

                        int selectedTechId = technicians
                            .Select(t => new
                            {
                                t.Id,
                                Count = loads.FirstOrDefault(l => l.TecnicoId == t.Id)?.Count ?? 0
                            })
                            .OrderBy(x => x.Count)
                            .ThenBy(x => x.Id)
                            .First().Id;

                        ticket.TecnicoId = selectedTechId;
                        ticket.Estado = TicketEstado.Asignado;
                    }
                }
                catch
                {
                    ticket.TecnicoId = null;
                    ticket.Estado = TicketEstado.Esperando;
                }

                _context.Tickets.Add(ticket);
                await _context.SaveChangesAsync();

                message.TicketId = ticket.Id;
            }

            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMessagesByTicket), new { ticketId = message.TicketId }, message);
        }
    }
}
