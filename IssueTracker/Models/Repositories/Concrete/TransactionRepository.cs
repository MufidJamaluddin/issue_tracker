using IssueTracker.Models.Datas;
using IssueTracker.Models.Datas.Schemas;
using IssueTracker.Models.ViewModels;
using System;

namespace IssueTracker.Models.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        protected IssueTrackerDbContext DbContext { get; set; }

        public TransactionRepository(IssueTrackerDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public string InitializeTransaction(TableTransactionVM data)
        {
            if (data == null)
            {
                throw new ArgumentNullException(nameof(data));
            }

            TableTransaction transactionData = new TableTransaction
            {
                Id = Guid.NewGuid().ToString("N"),
                IpAddress = data.IpAddress,
                UserId = data.UserId,
                CreatedAt = DateTime.Now,
            };

            DbContext.Add(transactionData);
            DbContext.SaveChanges();

            return transactionData.Id;
        }
    }
}
