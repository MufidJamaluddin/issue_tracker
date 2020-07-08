using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;

namespace IssueTracker.Services
{
    public interface ITicketServices
    {
        public PaginationResponse<TicketVM> SearchDataWithPagination(SearchPaginationRequest<TicketVM> request);

        public PaginationResponse<TicketVM> GetDataWithPagination(PaginationRequest request);

        public CommonResponse<TicketVM> SaveNewData(TicketVM data, TableTransactionVM transaction);

        public CommonResponse<TicketVM> UpdateData(TicketVM data, TableTransactionVM transaction);

        public CommonResponse<TicketVM> DeleteData(TicketVM data, TableTransactionVM transaction);
    }
}
