using IssueTracker.Models.Datas;
using IssueTracker.ToDevs;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

namespace IssueTracker.IntegrationTest
{
    public class IntegrationTestWebAppFactory<TStartup> : WebApplicationFactory<Startup>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                services.AddDbContextPool<IssueTrackerDbContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryAppDb");

                    options.UseInternalServiceProvider(
                        new ServiceCollection()
                            .AddEntityFrameworkInMemoryDatabase()
                            .BuildServiceProvider()
                    );
                }, 1);

                ServiceProvider serviceProvider = services.BuildServiceProvider();

                using IServiceScope scope = serviceProvider.CreateScope();
                IServiceProvider scopedServices = scope.ServiceProvider;
                IssueTrackerDbContext applicationDatabase = scopedServices.GetRequiredService<IssueTrackerDbContext>();

                ILogger<IntegrationTestWebAppFactory<TStartup>> logger = scopedServices.GetRequiredService<ILogger<IntegrationTestWebAppFactory<TStartup>>>();

                // Belum Ketemu Destroy DB Test Sebelumnya dari Memory, 
                // DB Context Singleton Pool
                try
                {
                    applicationDatabase.Database.EnsureDeleted();

                    applicationDatabase.Database.EnsureCreated();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occured while preparing test database. Info: {ex.Message}");
                }

                try
                {
                    SeedRunner.Run(applicationDatabase);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occured while populating test data. Info: {ex.Message}");
                }
            });
        }
    }
}
