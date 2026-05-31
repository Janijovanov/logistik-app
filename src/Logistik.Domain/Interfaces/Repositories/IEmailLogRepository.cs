using Logistik.Domain.Entities;
using Logistik.Domain.Enums;

namespace Logistik.Domain.Interfaces.Repositories;

public interface IEmailLogRepository : IRepository<EmailLog>
{
    Task<IReadOnlyList<EmailLog>> GetFailedEmailsAsync(int maxRetries = 3, CancellationToken ct = default);
    Task<bool> WasRecentlyNotifiedAsync(int entityId, string entityType, EmailNotificationType type, TimeSpan within, CancellationToken ct = default);
    Task<EmailLog?> GetByEnforcementOrderIdAsync(int orderId, CancellationToken ct = default);
}
