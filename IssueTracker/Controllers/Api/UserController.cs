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
    public class UserController : Controller
    {
        private IUserServices UserServices { get; }

        public UserController(
            IUserServices UserServices
        )
        {
            this.UserServices = UserServices;
        }

        [HttpGet]
        [Route("get/{id}")]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public UserVM GetOneData(string id)
        {
            return UserServices.GetDataById(id);
        }

        /// <summary>
        /// Get User Data with Pagination
        /// </summary>
        [HttpGet]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public PaginationResponse<UserVM> GetDataWithPagination([FromQuery] PaginationRequest request)
        {
            return UserServices.GetDataWithPagination(request);
        }

        /// <summary>
        /// Search User Data with Pagination
        /// </summary>
        [HttpPost]
        [Route("search")]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public PaginationResponse<UserVM> SearchDataWithPagination([FromBody] SearchPaginationRequest<UserVM> request)
        {
            return UserServices.SearchDataWithPagination(request);
        }

        /// <summary>
        /// Save New User Data
        /// </summary>
        [HttpPost]
        [Authorize(Roles = RolePolicy.ProductOwner)]
        public CommonResponse<UserVM> SaveNewData(UserVM data)
        {
            string myUserId = User.FindFirst(ClaimTypes.Name)?.Value;

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
        [Authorize(Roles = RolePolicy.ProductOwner)]
        public CommonResponse<UserVM> UpdateData([FromBody] UserVM data)
        {
            string myUserId = User.FindFirst(ClaimTypes.Name)?.Value;

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
        [Authorize(Roles = RolePolicy.ProductOwner)]
        public CommonResponse<UserVM> DeleteData([FromBody] UserVM data)
        {
            string myUserId = User.FindFirst(ClaimTypes.Name)?.Value;

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return UserServices.DeleteData(data, transaction);
        }
    }
}
