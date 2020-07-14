using IssueTracker.Helpers;
using IssueTracker.Helpers.Logger;
using IssueTracker.Middleware;
using IssueTracker.Models;
using IssueTracker.Models.Datas;
using IssueTracker.ToDevs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

namespace IssueTracker
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public virtual void ConfigureDatabase(IServiceCollection services)
        {
            if (!int.TryParse(Configuration["DatabasePool"], out int dbPoolSize))
            {
                dbPoolSize = 2;
            }

            services.AddDbContextPool<IssueTrackerDbContext>((options) =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("IssueTrackerDB"));

                if (Configuration.GetValue<bool>("AppConfig:SensitiveDataLogging"))
                {
                    options.EnableSensitiveDataLogging();
                }

            }, dbPoolSize);
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews().AddNewtonsoftJson();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            ConfigureDatabase(services);

            IConfigurationSection appConfig = Configuration.GetSection("AppConfig");
            services.Configure<AppConfig>(appConfig);

            RegisterDI.Register(services);

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Configuration.GetSection("AppConfig:JwtIssuer").Get<string>(),
                        ValidAudience = Configuration.GetSection("AppConfig:JwtAudience").Get<string>(),
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(Configuration.GetSection("AppConfig:Secret").Get<string>())
                        ),
                    };
                });

            services.AddAuthorization(config =>
            {
                config.AddPolicy(RolePolicy.User, RolePolicy.UserPolicy());
                config.AddPolicy(RolePolicy.ProductOwner, RolePolicy.ProductOwnerPolicy());
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Issue Tracker",
                    Description = "Issue Tracker API for Issue Tracker Web",
                    Contact = new OpenApiContact
                    {
                        Name = "Mufid Jamaluddin",
                        Email = "mufid.jamaluddin@gmail.com",
                    },
                });

                string xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                string xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IssueTrackerDbContext dbContext, ILoggerFactory loggerFactory)
        {
            AppConfig appConfig = Configuration.GetSection("AppConfig").Get<AppConfig>();

            List<AppLoggerConfiguration> loggerConfigs = new List<AppLoggerConfiguration> {
                new AppLoggerConfiguration {
                    LogLevel = LogLevel.Error,
                    EventId = 0,
                },
                new AppLoggerConfiguration {
                    LogLevel = LogLevel.Warning,
                    EventId = 0,
                },
            };

            loggerConfigs.ForEach(item =>
            {
                using AppLoggerProvider logger = new AppLoggerProvider(item, dbContext);

                loggerFactory?.AddProvider(logger);
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseSwagger(u =>
                {
                    u.SerializeAsV2 = true;
                });

                app.UseSwaggerUI(u =>
                {
                    u.SwaggerEndpoint("/swagger/v1/swagger.json", "Issue Tracker API");
                });

                // TIDAK DIREKOMENDASIKAN AUTO MIGRATE DI PRODUCTION
                // KARENA BELUM TENTU HANDLE MIGRASI DATA & RUN APPS NYA LAMA

                dbContext?.Database.Migrate();

                SeedRunner.Run(dbContext);
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            if (appConfig.UseHttps)
            {
                app.UseHttpsRedirection();
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseJwtInCookie();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
