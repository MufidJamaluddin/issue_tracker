using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace IssueTracker.Models.Datas.Schemas
{
    public class TicketStatus : IBaseModel
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
        public bool IsDeleted { get; set; }
    }
}
