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
    public class StatsController : ControllerBase
    {
        private readonly HelpDeskContext _context;

        public StatsController(HelpDeskContext context)
        {
            _context = context;
        }

        public class AdminStatsDto
        {
            public int Usuarios { get; set; }
            public int TicketsTotal { get; set; }
            public int TicketsActivos { get; set; }
            public int TicketsResueltos { get; set; }
            public int TicketsSinAsignar { get; set; }
            public double Satisfaccion { get; set; }
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<AdminStatsDto>> GetAdminStats()
        {
            var usuarios = await _context.Users.CountAsync();
            var ticketsTotal = await _context.Tickets.CountAsync();
            var ticketsResueltos = await _context.Tickets.CountAsync(t => t.Estado == TicketEstado.Resuelto);
            var ticketsActivos = ticketsTotal - ticketsResueltos;
            var ticketsSinAsignar = await _context.Tickets.CountAsync(t => t.TecnicoId == null);

            // Satisfacción basada en calificaciones (promedio/5 * 100). Si no hay calificados, usar % de resueltos.
            var ratedQuery = _context.Tickets.Where(t => t.Calificacion != null).Select(t => t.Calificacion!.Value);
            var ratedCount = await ratedQuery.CountAsync();
            double satisfaccion = 0.0;
            if (ratedCount > 0)
            {
                var avg = await ratedQuery.AverageAsync();
                satisfaccion = Math.Round((avg / 5.0) * 100.0, 1);
            }
            else if (ticketsTotal > 0)
            {
                satisfaccion = Math.Round(((double)ticketsResueltos / ticketsTotal) * 100.0, 1);
            }

            return new AdminStatsDto
            {
                Usuarios = usuarios,
                TicketsTotal = ticketsTotal,
                TicketsActivos = ticketsActivos,
                TicketsResueltos = ticketsResueltos,
                TicketsSinAsignar = ticketsSinAsignar,
                Satisfaccion = satisfaccion
            };
        }

        public class TechStatsDto
        {
            public int Assigned { get; set; }
            public int InProgress { get; set; }
            public int Resolved { get; set; }
            public int Overdue { get; set; }
            public double AvgRating { get; set; }
            public int RatedCount { get; set; }
        }

        [HttpGet("tech/{tecnicoId?}")]
        [Authorize(Roles = "Tecnico,Administrador")]
        public async Task<ActionResult<TechStatsDto>> GetTechStats(int? tecnicoId = null)
        {
            int id = tecnicoId ?? int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var myTickets = _context.Tickets.Where(t => t.TecnicoId == id);

            var assigned = await myTickets.CountAsync(t => t.Estado == TicketEstado.Asignado);
            var inProgress = await myTickets.CountAsync(t => t.Estado == TicketEstado.EnProgreso);
            var resolved = await myTickets.CountAsync(t => t.Estado == TicketEstado.Resuelto);

            // Vencidos: asignados o en progreso con más de 7 días desde creación (heurística)
            var threshold = DateTime.UtcNow.AddDays(-7);
            var overdue = await myTickets.CountAsync(t => (t.Estado == TicketEstado.Asignado || t.Estado == TicketEstado.EnProgreso) && t.FechaCreacion < threshold);

            var ratedQ = myTickets.Where(t => t.Calificacion != null).Select(t => t.Calificacion!.Value);
            var ratedCount = await ratedQ.CountAsync();
            double avgRating = 0.0;
            if (ratedCount > 0)
            {
                avgRating = await ratedQ.AverageAsync();
            }

            return new TechStatsDto
            {
                Assigned = assigned,
                InProgress = inProgress,
                Resolved = resolved,
                Overdue = overdue,
                AvgRating = Math.Round(avgRating, 2),
                RatedCount = ratedCount
            };
        }

        public class UserStatsDto
        {
            public int Activos { get; set; }
            public int Resueltos { get; set; }
            public int Total { get; set; }
        }

        [HttpGet("user/{usuarioId?}")]
        public async Task<ActionResult<UserStatsDto>> GetUserStats(int? usuarioId = null)
        {
            int id = usuarioId ?? int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var mine = _context.Tickets.Where(t => t.UsuarioId == id);
            var total = await mine.CountAsync();
            var resueltos = await mine.CountAsync(t => t.Estado == TicketEstado.Resuelto);
            var activos = total - resueltos;

            return new UserStatsDto
            {
                Activos = activos,
                Resueltos = resueltos,
                Total = total
            };
        }

        public class RatingPrompt
        {
            public int TicketId { get; set; }
            public string Titulo { get; set; } = string.Empty;
            public DateTime FechaResolucion { get; set; }
        }

        // Tickets del usuario resueltos y sin calificación
        [HttpGet("user/pending-ratings/{usuarioId?}")]
        public async Task<ActionResult<IEnumerable<RatingPrompt>>> GetUserPendingRatings(int? usuarioId = null)
        {
            int id = usuarioId ?? int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var list = await _context.Tickets
                .Where(t => t.UsuarioId == id && t.Estado == TicketEstado.Resuelto && t.Calificacion == null)
                .OrderByDescending(t => t.FechaCreacion)
                .Select(t => new RatingPrompt
                {
                    TicketId = t.Id,
                    Titulo = t.Titulo,
                    FechaResolucion = t.FechaCreacion
                })
                .ToListAsync();

            return list;
        }

        public class ActivityItem
        {
            public string Type { get; set; } = string.Empty; // ticket_created | message
            public int? TicketId { get; set; }
            public string Message { get; set; } = string.Empty;
            public DateTime When { get; set; }
        }

        [HttpGet("recent")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<IEnumerable<ActivityItem>>> GetRecentActivity()
        {
            var recentTickets = await _context.Tickets
                .Include(t => t.Usuario)
                .OrderByDescending(t => t.FechaCreacion)
                .Take(10)
                .Select(t => new ActivityItem
                {
                    Type = "ticket_created",
                    TicketId = t.Id,
                    When = t.FechaCreacion,
                    Message = $"Ticket #{t.Id} creado por {t.Usuario!.Nombre}: {t.Titulo}"
                })
                .ToListAsync();

            var recentMessages = await _context.ChatMessages
                .Include(m => m.Usuario)
                .OrderByDescending(m => m.Fecha)
                .Take(10)
                .Select(m => new ActivityItem
                {
                    Type = "message",
                    TicketId = m.TicketId,
                    When = m.Fecha,
                    Message = $"Mensaje en Ticket #{m.TicketId} por {m.Usuario!.Nombre}: {m.Mensaje}"
                })
                .ToListAsync();

            var merged = recentTickets
                .Concat(recentMessages)
                .OrderByDescending(a => a.When)
                .Take(10)
                .ToList();

            return merged;
        }
    }
}
