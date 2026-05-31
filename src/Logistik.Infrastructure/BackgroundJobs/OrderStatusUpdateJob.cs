using Logistik.Domain.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Logistik.Infrastructure.BackgroundJobs;

public class OrderStatusUpdateJob
{
    private readonly IServiceProvider _services;
    private readonly ILogger<OrderStatusUpdateJob> _logger;

    public OrderStatusUpdateJob(IServiceProvider services, ILogger<OrderStatusUpdateJob> logger)
    {
        _services = services;
        _logger = logger;
    }

    public async Task ExecuteAsync()
    {
        using var scope = _services.CreateScope();
        var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        var activeOrders = await uow.EnforcementOrders.GetAllActiveOrdersAsync();
        int updated = 0;

        foreach (var order in activeOrders)
        {
            var oldStatus = order.Status;
            order.RecalculateStatus();
            if (order.Status != oldStatus)
            {
                order.UpdatedAt = DateTime.UtcNow;
                uow.EnforcementOrders.Update(order);
                updated++;
            }
        }

        if (updated > 0)
            await uow.SaveChangesAsync();

        _logger.LogInformation("OrderStatusUpdateJob: updated {Count} orders.", updated);
    }
}
