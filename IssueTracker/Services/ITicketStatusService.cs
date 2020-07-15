using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using System.Collections.Generic;

namespace IssueTracker.Services
{
    public interface ITicketStatusServices
    {
        public IEnumerable<TicketStatusVM> GetAllData();

        public CommonResponse<TicketStatusVM> SaveNewData(TicketStatusVM data, TableTransactionVM transaction);

        public CommonResponse<TicketStatusVM> UpdateData(TicketStatusVM data, TableTransactionVM transaction);

        public CommonResponse<TicketStatusVM> DeleteData(TicketStatusVM data, TableTransactionVM transaction);
    }
}
