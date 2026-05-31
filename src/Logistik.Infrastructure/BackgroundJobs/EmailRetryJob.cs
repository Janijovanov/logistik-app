using Logistik.Application.Common.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Logistik.Infrastructure.BackgroundJobs;

public class EmailRetryJob
{
    private readonly IServiceProvider _services;
    private readonly ILogger<EmailRetryJob> _logger;

    public EmailRetryJob(IServiceProvider services, ILogger<EmailRetryJob> logger)
    {
        _services = services;
        _logger = logger;
    }

    public async Task ExecuteAsync()
    {
        using var scope = _services.CreateScope();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
        await emailService.RetryFailedAsync();
        _logger.LogInformation("EmailRetryJob executed.");
    }
}
