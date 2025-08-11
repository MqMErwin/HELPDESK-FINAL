using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDeskAPI.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }

        [Required]
        public int TicketId { get; set; }

        [ForeignKey("TicketId")]
        public Ticket? Ticket { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        [ForeignKey("UsuarioId")]
        public User? Usuario { get; set; }

        [Required]
        public string Mensaje { get; set; } = string.Empty;

        public DateTime Fecha { get; set; } = DateTime.UtcNow;

    }
}
