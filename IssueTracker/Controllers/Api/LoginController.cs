using IssueTracker.Models;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using IssueTracker.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        [Authorize(Roles = RolePolicy.User + "," + RolePolicy.ProductOwner)]
        public UserVM GetUserData()
        {
            return new UserVM
            {
                Id = User.FindFirst(ClaimTypes.Name)?.Value,
                Email = User.FindFirst(ClaimTypes.Email)?.Value,
                Role = User.FindFirst(ClaimTypes.Role)?.Value,
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
