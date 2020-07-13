using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;

namespace IssueTracker.Models.Repositories
{
    public interface ITicketRepository : IBaseRepository<TicketVM>
    {
        public CommonResponse<TicketVM> UpdateData(TicketVM data, string transactionId, string loggedUserId);
    }
}
