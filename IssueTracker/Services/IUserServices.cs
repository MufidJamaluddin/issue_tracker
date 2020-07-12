using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;

namespace IssueTracker.Services
{
    public interface IUserServices
    {
        public UserVM GetDataById(string id);
        public PaginationResponse<UserVM> SearchDataWithPagination(SearchPaginationRequest<UserVM> request);

        public PaginationResponse<UserVM> GetDataWithPagination(PaginationRequest request);

        public CommonResponse<UserVM> SaveNewData(UserVM data, TableTransactionVM transaction);

        public CommonResponse<UserVM> UpdateData(UserVM data, TableTransactionVM transaction);

        public CommonResponse<UserVM> DeleteData(UserVM data, TableTransactionVM transaction);
    }
}
