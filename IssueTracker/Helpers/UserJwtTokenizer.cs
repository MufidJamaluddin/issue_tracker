using IssueTracker.Models.ViewModels;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IssueTracker.Helpers
{
    public static class UserJwtTokenizer
    {
        public static string GenerateJwtToken(this UserVM user, string secretKey, AppConfig config)
        {
            if (user == null)
            {
                return null;
            }

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(secretKey);
            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(
                        ClaimTypes.Name,
                        user.Id
                    ),
                    new Claim(
                        ClaimTypes.Email,
                        user.Email
                    ),
                    new Claim(
                        ClaimTypes.Role,
                        user.Role
                    )
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature
                ),
                Issuer = config?.JwtIssuer,
                Audience = config?.JwtAudience,
            };
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
