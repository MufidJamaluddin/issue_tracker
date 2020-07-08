using IssueTracker.Helpers;
using IssueTracker.Models.Repositories;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace IssueTracker.Services.Concrete
{
    public class AuthServices : IAuthServices
    {
        private readonly AppConfig _appSettings;
        private readonly ILogger<AuthServices> _logger;
        private readonly IUserRepository _userRepository;

        public AuthServices(
            IOptions<AppConfig> appConfig,
            ILogger<AuthServices> logger,
            IUserRepository userRepository
        )
        {
            _appSettings = appConfig?.Value;
            _logger = logger;
            _userRepository = userRepository;
        }

        public CommonSResponse<AuthenticateResponse> Authenticate(AuthenticateRequest model, string clientIpAddress)
        {
            System.Collections.Generic.List<System.ComponentModel.DataAnnotations.ValidationResult> validationRequest = model.ValidateModelData(true);

            if (validationRequest.Count > 0)
            {
                string message = string.Join(", ", validationRequest.Select(u => u.ErrorMessage).ToArray());

                return new CommonSResponse<AuthenticateResponse>
                {
                    Status = false,
                    Code = "E-002",
                    Message = message,
                };
            }

            UserVM user = _userRepository.GetOne(new UserVM { Email = model?.Email });

            using SHA256 hasher = SHA256.Create();

            string modelPassword = Convert
                .ToBase64String(hasher.ComputeHash(Encoding.ASCII.GetBytes(model?.Password)));

            if (
                string.Equals(
                    user.Password,
                    modelPassword,
                    StringComparison.InvariantCulture
                )
            )
            {
                string token = user.GenerateJwtToken(_appSettings.Secret);

                AuthenticateResponse data = new AuthenticateResponse(user, token);

                _logger.LogInformation("Login User {0} from IP {1} Success",
                    user.Email,
                    clientIpAddress
                );

                return new CommonSResponse<AuthenticateResponse>
                {
                    Status = true,
                    Code = "S",
                    Message = "Authentication Successed!",
                    Data = data,
                };
            }
            else
            {
                _logger.LogInformation("Login User {0} from IP {1} Failed by Wrong Password",
                    user.Email,
                    clientIpAddress
                );
            }

            return new CommonSResponse<AuthenticateResponse>
            {
                Status = false,
                Code = "E-002",
                Message = "Password Doesn't Match!",
            };
        }

    }
}
