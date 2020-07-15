using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IssueTracker.Models.Datas.Schemas
{
    public class TicketHistory
    {
        public string Id { get; set; }

        public string TransactionId { get; set; }

        public int Seq { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime CreatedDate { get; set; }

        public User Assignee { get; set; }

        public User Owner { get; set; }

        public Category Category { get; set; }

        public TicketStatus Status { get; set; }

        [Required]
        public TableTransactionOperation Operation { get; set; }

        [ForeignKey("Id")]
        public virtual Ticket Ticket { get; set; }

        [ForeignKey("TransactionId")]
        public virtual TableTransaction TableTransaction { get; set; }

        public void FillFromTicket(
            Ticket ticket,
            string transactionId,
            int sequence,
            TableTransactionOperation operation
        )
        {
            if (ticket == null)
            {
                throw new ArgumentNullException(nameof(ticket));
            }

            Id = ticket.Id;
            Seq = sequence;
            Name = ticket.Name;
            Description = ticket.Description;
            CreatedDate = ticket.CreatedDate;
            Assignee = ticket.Assignee;
            Owner = ticket.Owner;
            Category = ticket.Category;
            Status = ticket.Status;
            Operation = operation;
            TransactionId = transactionId;
        }
    }
}
