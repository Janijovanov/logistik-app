using Logistik.Domain.Entities;
using Logistik.Domain.Enums;
using Logistik.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Logistik.Infrastructure.Persistence.Repositories;

public class EmailLogRepository : BaseRepository<EmailLog>, IEmailLogRepository
{
    public EmailLogRepository(AppDbContext context) : base(context) { }

    public async Task<IReadOnlyList<EmailLog>> GetFailedEmailsAsync(int maxRetries = 3, CancellationToken ct = default)
        => await _dbSet.Where(e => !e.IsSent && e.RetryCount < maxRetries && e.CreatedAt > DateTime.UtcNow.AddHours(-24))
            .ToListAsync(ct);

    public async Task<bool> WasRecentlyNotifiedAsync(int entityId, string entityType, EmailNotificationType type, TimeSpan within, CancellationToken ct = default)
        => await _dbSet.AnyAsync(e =>
            e.RelatedEntityId == entityId &&
            e.RelatedEntityType == entityType &&
            e.NotificationType == type &&
            e.IsSent &&
            e.SentAt.HasValue &&
            e.SentAt > DateTime.UtcNow - within, ct);

    public async Task<EmailLog?> GetByEnforcementOrderIdAsync(int orderId, CancellationToken ct = default)
        => await _dbSet
            .Where(e => e.RelatedEntityType == "EnforcementOrder" && e.RelatedEntityId == orderId)
            .OrderByDescending(e => e.CreatedAt)
            .FirstOrDefaultAsync(ct);
}
