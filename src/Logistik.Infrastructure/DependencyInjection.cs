using Logistik.Application.Common.Interfaces;
using Logistik.Domain.Interfaces;
using Logistik.Infrastructure.BackgroundJobs;
using Logistik.Infrastructure.Persistence;
using Logistik.Infrastructure.Persistence.Seeders;
using Logistik.Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Logistik.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")!;

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IExportService, ExportService>();

        services.AddHttpContextAccessor();

        services.AddScoped<DatabaseSeeder>();
        services.AddTransient<OrderStatusUpdateJob>();
        services.AddTransient<EmploymentEndCheckJob>();
        services.AddTransient<EmailRetryJob>();

        return services;
    }
}
