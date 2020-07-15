using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using System.Security.Claims;

namespace IssueTracker.Services
{
    public interface IAuthServices
    {
        public AuthenticateResponse GetCurrentAuthUserData(ClaimsPrincipal userClaim);
        public CommonSResponse<AuthenticateResponse> Authenticate(AuthenticateRequest model, string IpAddress);
    }
}
