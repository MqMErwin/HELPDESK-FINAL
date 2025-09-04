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
            var userId = int.Parse(User.Claims.First(c => c.Type == "id").Value);

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
        [Authorize(Roles = "Tecnico")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTicketStatusRequest request)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            ticket.Estado = request.Estado;
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
