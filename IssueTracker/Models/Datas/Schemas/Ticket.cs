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

        public string AssigneeId { get; set; }

        public User Owner { get; set; }

        public string OwnerId { get; set; }

        public Category Category { get; set; }

        public string CategoryId { get; set; }

        public TicketStatus Status { get; set; }

        public string StatusId { get; set; }

        public ICollection<TicketHistory> TicketHistories { get; set; }
        public bool IsDeleted { get; set; }
    }
}
