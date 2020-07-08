using IssueTracker.Models;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using IssueTracker.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Controllers.Api
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private IUserServices UserServices { get; }

        public UserController(
            IUserServices UserServices
        )
        {
            this.UserServices = UserServices;
        }

        /// <summary>
        /// Get User Data with Pagination
        /// </summary>
        [HttpGet]
        //[Authorize(Policy = RolePolicy.ProductOwner)]
        public PaginationResponse<UserVM> GetDataWithPagination([FromQuery] PaginationRequest request)
        {
            return UserServices.GetDataWithPagination(request);
        }

        /// <summary>
        /// Search User Data with Pagination
        /// </summary>
        [HttpPost]
        [Route("search")]
        //[Authorize(Policy = RolePolicy.ProductOwner)]
        public PaginationResponse<UserVM> SearchDataWithPagination([FromBody] SearchPaginationRequest<UserVM> request)
        {
            return UserServices.SearchDataWithPagination(request);
        }

        /// <summary>
        /// Save New User Data
        /// </summary>
        [HttpPost]
        [Authorize(Policy = RolePolicy.ProductOwner)]
        public CommonResponse<UserVM> SaveNewData(UserVM data)
        {
            string myUserId = User.FindFirst("id").Value;

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return UserServices.SaveNewData(data, transaction);
        }

        /// <summary>
        /// Change User Data
        /// </summary>
        [HttpPut]
        [Authorize(Policy = RolePolicy.ProductOwner)]
        public CommonResponse<UserVM> UpdateData([FromBody] UserVM data)
        {
            string myUserId = User.FindFirst("id").Value;

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return UserServices.UpdateData(data, transaction);
        }

        /// <summary>
        /// Delete User Data
        /// </summary>
        [HttpDelete]
        [Authorize(Policy = RolePolicy.ProductOwner)]
        public CommonResponse<UserVM> DeleteData([FromBody] UserVM data)
        {
            string myUserId = User.FindFirst("id").Value;

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return UserServices.DeleteData(data, transaction);
        }
    }
}
