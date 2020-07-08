using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using IssueTracker.Services;
using Microsoft.AspNetCore.Mvc;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Controllers.Api
{
    [Route("api/[controller]")]
    public class CategoryController : Controller
    {
        private ICategoryServices CategoryServices { get; }

        public CategoryController(
            ICategoryServices categoryServices
        )
        {
            CategoryServices = categoryServices;
        }

        /// <summary>
        /// Get Category Data with Pagination
        /// </summary>
        [HttpGet]
        public PaginationResponse<CategoryVM> GetDataWithPagination([FromQuery] PaginationRequest request)
        {
            return CategoryServices.GetDataWithPagination(request);
        }

        /// <summary>
        /// Search Category Data with Pagination
        /// </summary>
        [HttpPost]
        [Route("search")]
        public PaginationResponse<CategoryVM> SearchDataWithPagination([FromBody] SearchPaginationRequest<CategoryVM> request)
        {
            return CategoryServices.SearchDataWithPagination(request);
        }

        /// <summary>
        /// Save New Category Data
        /// </summary>
        [HttpPost]
        public CommonResponse<CategoryVM> SaveNewData([FromBody] CategoryVM data)
        {
            string myUserId = User.FindFirst("id")?.Value ?? "USR-001"; // SEMENTARA

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return CategoryServices.SaveNewData(data, transaction);
        }

        /// <summary>
        /// Change New Category Data
        /// </summary>
        [HttpPut]
        public CommonResponse<CategoryVM> UpdateData([FromBody] CategoryVM data)
        {
            string myUserId = User.FindFirst("id")?.Value ?? "USR-001"; // SEMENTARA

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return CategoryServices.UpdateData(data, transaction);
        }

        /// <summary>
        /// Delete Category Data
        /// </summary>
        [HttpDelete]
        public CommonResponse<CategoryVM> DeleteData([FromBody] CategoryVM data)
        {
            string myUserId = User.FindFirst("id")?.Value ?? "USR-001"; // SEMENTARA

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return CategoryServices.DeleteData(data, transaction);
        }
    }
}
