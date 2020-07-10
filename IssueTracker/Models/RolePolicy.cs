using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace IssueTracker.Models
{
    public static class RolePolicy
    {
        public const string User = "User";

        public const string ProductOwner = "ProductOwner";

        public static AuthorizationPolicy UserPolicy()
        {
            return new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .RequireAssertion(context =>
                    context.User.HasClaim(ClaimTypes.Role, User)
                )
                .Build();
        }

        public static AuthorizationPolicy ProductOwnerPolicy()
        {
            return new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .RequireAssertion(context =>
                    context.User.HasClaim(ClaimTypes.Role, ProductOwner)
                )
                .Build();
        }
    }
}
