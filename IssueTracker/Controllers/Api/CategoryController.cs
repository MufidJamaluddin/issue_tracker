using IssueTracker.Models;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using IssueTracker.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        [Route("get/{id}")]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public CategoryVM GetOneData(string id)
        {
            return CategoryServices.GetDataById(id);
        }

        /// <summary>
        /// Get Category Data with Pagination
        /// </summary>
        [HttpGet]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public PaginationResponse<CategoryVM> GetDataWithPagination([FromQuery] PaginationRequest request)
        {
            return CategoryServices.GetDataWithPagination(request);
        }

        /// <summary>
        /// Search Category Data with Pagination
        /// </summary>
        [HttpPost]
        [Route("search")]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public PaginationResponse<CategoryVM> SearchDataWithPagination([FromBody] SearchPaginationRequest<CategoryVM> request)
        {
            return CategoryServices.SearchDataWithPagination(request);
        }

        /// <summary>
        /// Save New Category Data
        /// </summary>
        [HttpPost]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public CommonResponse<CategoryVM> SaveNewData([FromBody] CategoryVM data)
        {
            string myUserId = User.FindFirst(ClaimTypes.Name)?.Value;

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
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public CommonResponse<CategoryVM> UpdateData([FromBody] CategoryVM data)
        {
            string myUserId = User.FindFirst(ClaimTypes.Name)?.Value;

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
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public CommonResponse<CategoryVM> DeleteData([FromBody] CategoryVM data)
        {
            string myUserId = User.FindFirst(ClaimTypes.Name)?.Value;

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return CategoryServices.DeleteData(data, transaction);
        }
    }
}
