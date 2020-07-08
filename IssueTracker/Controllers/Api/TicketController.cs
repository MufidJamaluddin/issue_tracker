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
    public class TicketController : Controller
    {
        private ITicketServices TicketServices { get; }

        public TicketController(
            ITicketServices TicketServices
        )
        {
            this.TicketServices = TicketServices;
        }

        /// <summary>
        /// Get Ticket Data with Pagination
        /// </summary>
        [HttpGet]
        //[Authorize(Policy = RolePolicy.User)]
        public PaginationResponse<TicketVM> GetDataWithPagination([FromQuery] PaginationRequest request)
        {
            return TicketServices.GetDataWithPagination(request);
        }

        /// <summary>
        /// Search Ticket Data with Pagination
        /// </summary>
        [HttpPost]
        [Route("search")]
        //[Authorize(Policy = RolePolicy.User)]
        public PaginationResponse<TicketVM> SearchDataWithPagination([FromBody] SearchPaginationRequest<TicketVM> request)
        {
            string myUserId = User.FindFirst("id")?.Value ?? "USR-001"; // SEMENTARA

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
        //[Authorize(Policy = RolePolicy.User)]
        public CommonResponse<TicketVM> SaveNewData([FromBody] TicketVM data)
        {
            string myUserId = User.FindFirst("id")?.Value ?? "USR-001"; // SEMENTARA

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
        //[Authorize(Policy = RolePolicy.User)]
        public CommonResponse<TicketVM> UpdateData([FromBody] TicketVM data)
        {
            string myUserId = User.FindFirst("id")?.Value ?? "USR-001"; // SEMENTARA

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
        //[Authorize(Policy = RolePolicy.User)]
        public CommonResponse<TicketVM> DeleteData([FromBody] TicketVM data)
        {
            string myUserId = User.FindFirst("id")?.Value ?? "USR-001"; // SEMENTARA

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return TicketServices.DeleteData(data, transaction);
        }
    }
}
