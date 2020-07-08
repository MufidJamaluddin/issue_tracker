using IssueTracker.Models;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using IssueTracker.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Controllers.Api
{
    [Route("api/[controller]")]
    public class TicketStatusController : Controller
    {
        private ITicketStatusServices TicketStatusServices { get; }

        public TicketStatusController(
            ITicketStatusServices TicketStatusServices
        )
        {
            this.TicketStatusServices = TicketStatusServices;
        }

        /// <summary>
        /// Get All Ticket Status Data
        /// </summary>
        [HttpGet]
        public IEnumerable<TicketStatusVM> GetAllData()
        {
            return TicketStatusServices.GetAllData();
        }

        /// <summary>
        /// Save New Ticket Status Data
        /// </summary>
        [HttpPost]
        [Authorize(Policy = RolePolicy.ProductOwner)]
        public CommonResponse<TicketStatusVM> SaveNewData([FromBody] TicketStatusVM data)
        {
            string myUserId = User.FindFirst("id").Value;

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return TicketStatusServices.SaveNewData(data, transaction);
        }

        /// <summary>
        /// Change Ticket Data
        /// </summary>
        [HttpPut]
        [Authorize(Policy = RolePolicy.ProductOwner)]
        public CommonResponse<TicketStatusVM> UpdateData([FromBody] TicketStatusVM data)
        {
            string myUserId = User.FindFirst("id").Value;

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return TicketStatusServices.UpdateData(data, transaction);
        }

        /// <summary>
        /// Delete Ticket Data
        /// </summary>
        [HttpDelete]
        [Authorize(Policy = RolePolicy.ProductOwner)]
        public CommonResponse<TicketStatusVM> DeleteData([FromBody] TicketStatusVM data)
        {
            string myUserId = User.FindFirst("id").Value;

            TableTransactionVM transaction = new TableTransactionVM
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                UserId = myUserId,
            };

            return TicketStatusServices.DeleteData(data, transaction);
        }
    }
}
