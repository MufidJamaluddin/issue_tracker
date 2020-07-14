using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Primitives;
using System.Globalization;

/**
 *  Handle JWT in Cookie
 **/
namespace IssueTracker.Middleware
{
    public static class JwtInCookieMiddleware
    {
        public const string JWT_COOKIE_KEY = "token";

        public static void UseJwtInCookie(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                bool is_cookie_used = true;

                if (!context.Request.Headers.TryGetValue("Authorization", out StringValues headerToken))
                {
                    is_cookie_used = true;
                }

                if (string.IsNullOrEmpty(headerToken))
                {
                    is_cookie_used = true;
                }

                if (is_cookie_used)
                {
                    if (!context.Request.Cookies.TryGetValue(JWT_COOKIE_KEY, out string cookieToken))
                    {
                        cookieToken = headerToken;
                    }

                    context.Request.Headers.Add("Authorization",
                        string.Format(CultureInfo.InvariantCulture, "Bearer {0}", cookieToken)
                    );
                }

                await next.Invoke();
            });
        }
    }
}
