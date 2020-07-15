using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;

namespace IssueTracker.Services
{
    public interface ICategoryServices
    {
        public CategoryVM GetDataById(string id);
        public PaginationResponse<CategoryVM> SearchDataWithPagination(SearchPaginationRequest<CategoryVM> request);

        public PaginationResponse<CategoryVM> GetDataWithPagination(PaginationRequest request);

        public CommonResponse<CategoryVM> SaveNewData(CategoryVM data, TableTransactionVM transaction);

        public CommonResponse<CategoryVM> UpdateData(CategoryVM data, TableTransactionVM transaction);

        public CommonResponse<CategoryVM> DeleteData(CategoryVM data, TableTransactionVM transaction);
    }
}
