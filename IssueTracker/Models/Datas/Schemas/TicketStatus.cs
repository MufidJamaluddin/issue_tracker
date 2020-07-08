using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace IssueTracker.Models.Datas.Schemas
{
    public class TicketStatus
    {
        [Key]
        [StringLength(6)]
        public string Id { get; set; }

        [Required]
        [StringLength(20)]
        public string Name { get; set; }

        [Required]
        [StringLength(10)]
        public string Color { get; set; }

        public ICollection<TicketStatusHistory> TicketStatusHistories { get; set; }
    }
}
