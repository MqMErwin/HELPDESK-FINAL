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
                    UsuarioId = message.UsuarioId,
                    Estado = TicketEstado.Esperando,
                    FechaCreacion = DateTime.UtcNow
                };

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
