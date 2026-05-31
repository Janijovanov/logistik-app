using Logistik.Application.Common.Interfaces;
using Logistik.Domain.Entities;
using Logistik.Domain.Enums;
using Logistik.Domain.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Logistik.Infrastructure.BackgroundJobs;

public class EmploymentEndCheckJob
{
    private readonly IServiceProvider _services;
    private readonly ILogger<EmploymentEndCheckJob> _logger;

    public EmploymentEndCheckJob(IServiceProvider services, ILogger<EmploymentEndCheckJob> logger)
    {
        _services = services;
        _logger = logger;
    }

    public async Task ExecuteAsync()
    {
        using var scope = _services.CreateScope();
        var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        var email = scope.ServiceProvider.GetRequiredService<IEmailService>();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var employees = await uow.Employees.GetEmployeesWithEndingEmploymentAsync(today, today.AddDays(30));
        int notified = 0;

        foreach (var employee in employees)
        {
            bool wasNotified = await uow.EmailLogs.WasRecentlyNotifiedAsync(
                employee.Id, "Employee", EmailNotificationType.EmploymentEnding, TimeSpan.FromDays(7));

            if (wasNotified) continue;

            var orders = await uow.EnforcementOrders.GetOrdersForEmployeeAsync(employee.Id, false);
            foreach (var order in orders)
            {
                var log = new EmailLog
                {
                    RecipientEmail = order.ExecutorEmail,
                    Subject = $"Opomnik — prenehanje zaposlitve: {employee.FullName}",
                    Body = $"Zaposleni {employee.FullName} (EMBG: {employee.EMBG}) ima datum prenehanja delovnega razmerja: {employee.EmploymentEndDate}. " +
                           $"To je opomnik, da bo izvrsno resenje {order.OrderNumber} morda prizadeto.",
                    NotificationType = EmailNotificationType.EmploymentEnding,
                    RelatedEntityType = "Employee",
                    RelatedEntityId = employee.Id
                };
                await email.QueueAsync(log);
                notified++;
            }
        }

        _logger.LogInformation("EmploymentEndCheckJob: sent {Count} notifications.", notified);
    }
}
