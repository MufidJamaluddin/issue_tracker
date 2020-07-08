using Microsoft.AspNetCore.Authorization;

namespace IssueTracker.Models
{
    public static class RolePolicy
    {
        public const string User = "User";

        public const string ProductOwner = "ProductOwner";

        public static AuthorizationPolicy UserPolicy()
        {
            return new AuthorizationPolicyBuilder().RequireAuthenticatedUser().RequireRole(User).Build();
        }

        public static AuthorizationPolicy ProductOwnerPolicy()
        {
            return new AuthorizationPolicyBuilder().RequireAuthenticatedUser().RequireRole(ProductOwner).Build();
        }
    }
}
