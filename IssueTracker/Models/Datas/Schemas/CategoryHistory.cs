using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IssueTracker.Models.Datas.Schemas
{
    public class CategoryHistory
    {
        public string Id { get; set; }

        public string TransactionId { get; set; }

        public int Seq { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        public TableTransactionOperation Operation { get; set; }

        [ForeignKey("Id")]
        public virtual Category Category { get; set; }

        [ForeignKey("TransactionId")]
        public virtual TableTransaction TableTransaction { get; set; }

        public void FillFromCategory(
            Category category,
            string transactionId,
            int sequence,
            TableTransactionOperation operation
        )
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            Id = category.Id;
            Seq = sequence;
            Name = category.Name;
            Operation = operation;
            TransactionId = transactionId;
        }
    }
}
