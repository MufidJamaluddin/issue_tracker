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
    public class TicketController : Controller
    {
        private ITicketServices TicketServices { get; }

        public TicketController(
            ITicketServices TicketServices
        )
        {
            this.TicketServices = TicketServices;
        }

        [HttpGet]
        [Route("get/{id}")]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public TicketVM GetOneData(string id)
        {
            var data = TicketServices.GetDataById(id);

            data.SetLoggedUser(User.FindFirst("id")?.Value ?? "");

            return data;
        }

        /// <summary>
        /// Get Ticket Data with Pagination
        /// </summary>
        [HttpGet]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public PaginationResponse<TicketVM> GetDataWithPagination([FromQuery] PaginationRequest request)
        {
            var data = TicketServices.GetDataWithPagination(request);

            return data;
        }

        /// <summary>
        /// Search Ticket Data with Pagination
        /// </summary>
        [HttpPost]
        [Route("search")]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public PaginationResponse<TicketVM> SearchDataWithPagination([FromBody] SearchPaginationRequest<TicketVM> request)
        {
            string myUserId = User.FindFirst(ClaimTypes.Name)?.Value;

            if (request != null)
            {
                if (request.SearchData != null)
                {
                    request.SearchData.MyUserId = myUserId;
                }
            }

            return TicketServices.SearchDataWithPagination(request);
        }

        /// <summary>
        /// Save New Ticket Data
        /// </summary>
        [HttpPost]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public CommonResponse<TicketVM> SaveNewData([FromBody] TicketVM data)
        {
            string myUserId = User.FindFirst(ClaimTypes.Name)?.Value;

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            if (data != null)
            {
                data.MyUserId = myUserId;
            }

            return TicketServices.SaveNewData(data, transaction);
        }

        /// <summary>
        /// Change Ticket Data
        /// </summary>
        [HttpPut]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public CommonResponse<TicketVM> UpdateData([FromBody] TicketVM data)
        {
            string myUserId = User.FindFirst(ClaimTypes.Name)?.Value;

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return TicketServices.UpdateData(data, transaction);
        }

        /// <summary>
        /// Delete Ticket Data
        /// </summary>
        [HttpDelete]
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public CommonResponse<TicketVM> DeleteData([FromBody] TicketVM data)
        {
            string myUserId = User.FindFirst(ClaimTypes.Name)?.Value;

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return TicketServices.DeleteData(data, transaction);
        }
    }
}
