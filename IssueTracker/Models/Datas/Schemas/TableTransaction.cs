using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IssueTracker.Models.Datas.Schemas
{
    public class TableTransaction
    {
        [Key]
        [StringLength(32)]
        public string Id { get; set; }

        public string UserId { get; set; }

        [StringLength(45)]
        public string IpAddress { get; set; }
        public DateTime CreatedAt { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        public ICollection<UserHistory> UserHistories { get; set; }
        public ICollection<CategoryHistory> CategoryHistories { get; set; }
        public ICollection<TicketStatusHistory> TicketStatusHistories { get; set; }
        public ICollection<TicketHistory> TicketHistories { get; set; }
    }
}
