using IssueTracker.Models.Repositories;
using IssueTracker.Services;
using IssueTracker.Services.Concrete;
using Microsoft.Extensions.DependencyInjection;

namespace IssueTracker
{
    public static class RegisterDI
    {
        public static void Register(IServiceCollection services)
        {
            /**
             *  ADD DI REPOSITORY (SCOPED)
             **/
            services.AddScoped<ITransactionRepository, TransactionRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ITicketStatusRepository, TicketStatusRepository>();
            services.AddScoped<ITicketRepository, TicketRepository>();

            /**
             *  ADD DI SERVICES (SCOPED)
             **/
            services.AddScoped<IAuthServices, AuthServices>();
            services.AddScoped<IUserServices, UserServices>();
            services.AddScoped<ICategoryServices, CategoryServices>();
            services.AddScoped<ITicketServices, TicketServices>();
            services.AddScoped<ITicketStatusServices, TicketStatusServices>();

        }
    }
}
