using IssueTracker.Models;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using IssueTracker.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IssueTracker.Controllers.Api
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private IAuthServices AuthService { get; }

        public LoginController(
            IAuthServices authServices
        )
        {
            AuthService = authServices;
        }

        [HttpGet]
        [Authorize(Policy = RolePolicy.ProductOwner)]
        [Authorize(Policy = RolePolicy.User)]
        public UserVM GetUserData()
        {
            return new UserVM
            {
                Id = User.FindFirst("id")?.Value,
                Email = User.FindFirst("email")?.Value,
                Role = User.FindFirst("role")?.Value,
            };
        }

        /// <summary>
        /// Login for create token.
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public CommonSResponse<AuthenticateResponse> Login([FromBody] AuthenticateRequest request)
        {
            string clientIpAddress = HttpContext.Connection.RemoteIpAddress.ToString();

            return AuthService.Authenticate(request, clientIpAddress);
        }

    }
}
