using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;

namespace IssueTracker.Services
{
    public interface IAuthServices
    {
        public CommonSResponse<AuthenticateResponse> Authenticate(AuthenticateRequest model, string IpAddress);
    }
}
