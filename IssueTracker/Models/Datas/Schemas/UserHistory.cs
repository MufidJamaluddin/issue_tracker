using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IssueTracker.Models.Datas.Schemas
{
    public class UserHistory
    {
        public string Id { get; set; }
        public string TransactionId { get; set; }
        public int Seq { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(10)]
        public string Role { get; set; }

        [StringLength(256)]
        public string Email { get; set; }

        [Required]
        public TableTransactionOperation Operation { get; set; }

        [ForeignKey("Id")]
        public virtual User User { get; set; }

        [ForeignKey("TransactionId")]
        public virtual TableTransaction TableTransaction { get; set; }

        public void FillFromUser(
            User user,
            string transactionId,
            int sequence,
            TableTransactionOperation operation
        )
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            Id = user.Id;
            Seq = sequence;
            Name = user.Name;
            Role = user.Role;
            Email = user.Email;
            Operation = operation;
            TransactionId = transactionId;
        }
    }
}
