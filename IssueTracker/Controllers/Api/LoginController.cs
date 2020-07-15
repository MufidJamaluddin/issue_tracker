using IssueTracker.Middleware;
using IssueTracker.Models;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using IssueTracker.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
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
        public AuthenticateResponse GetUserData()
        {
            return this.AuthService.GetCurrentAuthUserData(User);
        }

        /// <summary>
        /// Login for create token.
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public CommonSResponse<AuthenticateResponse> Login([FromBody] AuthenticateRequest request)
        {
            string clientIpAddress = HttpContext.Connection.RemoteIpAddress.ToString();

            CommonSResponse<AuthenticateResponse> data = AuthService.Authenticate(request, clientIpAddress);

            if (data?.Data?.Token != null)
            {
                CookieOptions cookieOptions = new CookieOptions
                {
                    Domain = HttpContext.Request.Host.Value.ToString().Split(':')[0],
                    Path = "/",
                    Expires = DateTimeOffset.UtcNow.AddDays(7),
                    HttpOnly = true,
                    Secure = false,
                    SameSite = SameSiteMode.Lax,
                };

                Response.Cookies.Append(
                    JwtInCookieMiddleware.JWT_COOKIE_KEY,
                    data.Data.Token,
                    cookieOptions
                );
            }

            return data;
        }


        /// <summary>
        /// Logout for delete token.
        /// </summary>
        [HttpDelete]
        public CommonResponse<object> Logout()
        {
            Response.Cookies.Delete(JwtInCookieMiddleware.JWT_COOKIE_KEY);

            return new CommonResponse<object>
            {
                Code = "S",
                Message = "Logout Successed!",
                Status = true,
                Data = null,
            };
        }
    }
}
