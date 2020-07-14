using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace IssueTracker.Models.Datas.Schemas
{
    public class Ticket : IBaseModel
    {
        [Key]
        [StringLength(6)]
        public string Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime CreatedDate { get; set; }

        public User Assignee { get; set; }

        public User Owner { get; set; }

        public Category Category { get; set; }

        public TicketStatus Status { get; set; }

        public ICollection<TicketHistory> TicketHistories { get; set; }
        public bool IsDeleted { get; set; }
    }
}
