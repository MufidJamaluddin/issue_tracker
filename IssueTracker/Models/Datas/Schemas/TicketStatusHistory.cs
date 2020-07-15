using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IssueTracker.Models.Datas.Schemas
{
    public class TicketStatusHistory
    {
        public string Id { get; set; }

        public string TransactionId { get; set; }

        public int Seq { get; set; }

        [StringLength(20)]
        public string Name { get; set; }

        [StringLength(10)]
        public string Color { get; set; }

        [Required]
        public TableTransactionOperation Operation { get; set; }

        [ForeignKey("Id")]
        public virtual TicketStatus TicketStatus { get; set; }

        [ForeignKey("TransactionId")]
        public virtual TableTransaction TableTransaction { get; set; }

        public void FillFromTicketStatus(
            TicketStatus ticketStatus,
            string transactionId,
            int sequence,
            TableTransactionOperation operation
        )
        {
            if (ticketStatus == null)
            {
                throw new ArgumentNullException(nameof(ticketStatus));
            }

            Id = ticketStatus.Id;
            Seq = sequence;
            Name = ticketStatus.Name;
            Color = ticketStatus.Color;
            Operation = operation;
            TransactionId = transactionId;
        }
    }
}
