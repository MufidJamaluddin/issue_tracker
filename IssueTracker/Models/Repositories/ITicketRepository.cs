using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;

namespace IssueTracker.Models.Repositories
{
    public interface ITicketRepository : IBaseRepository<TicketVM>
    {
        public TicketVM GetOne(TicketVM searchedData, string loggedUserId);
        public CommonResponse<TicketVM> UpdateData(TicketVM data, string transactionId, string loggedUserId);
    }
}
