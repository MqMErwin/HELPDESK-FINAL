using HelpDeskAPI.Data;
using HelpDeskAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HelpDeskAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly HelpDeskContext _context;

        public TicketsController(HelpDeskContext context)
        {
            _context = context;
        }

        // GET: api/tickets
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetTickets()
        {
            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }
            var userId = int.Parse(userIdClaim);

            IQueryable<Ticket> query = _context.Tickets
                .Include(t => t.Usuario)
                .Include(t => t.Tecnico);

            if (role == "Solicitante")
            {
                query = query.Where(t => t.UsuarioId == userId);
            }
            else if (role == "Tecnico")
            {
                query = query.Where(t => t.TecnicoId == userId);
            }
            // Administrador ve todos los tickets

            var tickets = await query.ToListAsync();
            return Ok(tickets);
        }

        // GET: api/tickets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetTicket(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Usuario)
                .Include(t => t.Tecnico)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
                return NotFound();

            return ticket;
        }

        // POST: api/tickets
        [HttpPost]
        [Authorize(Roles = "Solicitante,Administrador")]
        public async Task<ActionResult<Ticket>> CreateTicket([FromBody] Ticket ticket)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Forbid();
            }

            ticket.UsuarioId = int.Parse(userIdClaim);
            ticket.TecnicoId = null;
            ticket.Estado = TicketEstado.Esperando;
            ticket.FechaCreacion = DateTime.UtcNow;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Intento de autoasignación: asignar al técnico con menor carga de tickets abiertos
            // Se aplica solo si existen usuarios con rol "Tecnico"
            try
            {
                var technicians = await _context.Users
                    .Where(u => u.Rol == "Tecnico")
                    .Select(u => new { u.Id })
                    .ToListAsync();

                if (technicians.Count > 0)
                {
                    // Cargas por técnico (tickets no resueltos)
                    var loads = await _context.Tickets
                        .Where(t => t.TecnicoId != null && t.Estado != TicketEstado.Resuelto)
                        .GroupBy(t => t.TecnicoId)
                        .Select(g => new { TecnicoId = g.Key!.Value, Count = g.Count() })
                        .ToListAsync();

                    // Seleccionar el técnico con menor carga
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
                // Si falla la autoasignación, se deja sin técnico y en estado Esperando
                ticket.TecnicoId = null;
                ticket.Estado = TicketEstado.Esperando;
            }

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, ticket);
        }

        // PUT: api/tickets/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] Ticket updatedTicket)
        {
            if (id != updatedTicket.Id)
            {
                return BadRequest();
            }

            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            ticket.Titulo = updatedTicket.Titulo;
            ticket.Descripcion = updatedTicket.Descripcion;
            ticket.TecnicoId = updatedTicket.TecnicoId;
            ticket.Estado = updatedTicket.Estado;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/tickets/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/tickets/{id}/assign
        [HttpPut("{id}/assign")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> AssignTicket(int id, [FromBody] AssignTicketRequest request)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            ticket.TecnicoId = request.TecnicoId;
            ticket.Estado = TicketEstado.Asignado;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/tickets/{id}/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Tecnico,Administrador")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTicketStatusRequest request)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            // Seguridad: solo el tecnico asignado o un Administrador puede cambiar el estado
            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (role != "Administrador")
            {
                if (userIdClaim == null || ticket.TecnicoId == null || ticket.TecnicoId != int.Parse(userIdClaim))
                {
                    return Forbid();
                }
            }

            var previous = ticket.Estado;
            ticket.Estado = request.Estado;
            await _context.SaveChangesAsync();

            // Si se marcó como Resuelto, notificar al usuario para calificar
            if (previous != TicketEstado.Resuelto && request.Estado == TicketEstado.Resuelto)
            {
                try
                {
                    int senderId = 0;
                    if (role == "Administrador")
                    {
                        // si es admin, usar su propio id
                        senderId = int.Parse(userIdClaim!);
                    }
                    else if (ticket.TecnicoId.HasValue)
                    {
                        senderId = ticket.TecnicoId.Value;
                    }

                    if (senderId > 0)
                    {
                        _context.ChatMessages.Add(new ChatMessage
                        {
                            TicketId = ticket.Id,
                            UsuarioId = senderId,
                            Mensaje = $"Tu ticket #{ticket.Id} fue marcado como RESUELTO. Por favor califica el servicio (1-5) desde tu panel.",
                            Fecha = DateTime.UtcNow
                        });
                        await _context.SaveChangesAsync();
                    }
                }
                catch { /* noop */ }
            }
            return NoContent();
        }

        public class RateTicketRequest
        {
            public int Calificacion { get; set; }
        }

        // POST: api/tickets/{id}/rate
        [HttpPost("{id}/rate")]
        [Authorize(Roles = "Solicitante,Administrador")]
        public async Task<IActionResult> RateTicket(int id, [FromBody] RateTicketRequest request)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return NotFound();

            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var uid = userIdClaim != null ? int.Parse(userIdClaim) : 0;

            if (role != "Administrador" && ticket.UsuarioId != uid)
                return Forbid();

            if (request.Calificacion < 1 || request.Calificacion > 5)
                return BadRequest("Calificacion debe estar entre 1 y 5");

            ticket.Calificacion = request.Calificacion;
            ticket.FechaCalificacion = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/tickets/{id}/resolve
        [HttpPost("{id}/resolve")]
        [Authorize(Roles = "Tecnico,Administrador")]
        public async Task<IActionResult> ResolveTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
