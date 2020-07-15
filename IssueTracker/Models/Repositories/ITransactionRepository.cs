using IssueTracker.Models.ViewModels;

namespace IssueTracker.Models.Repositories
{
    public interface ITransactionRepository
    {
        /**
         *  GET ID TRANSACTION
         **/
        public string InitializeTransaction(TableTransactionVM data);
    }
}
