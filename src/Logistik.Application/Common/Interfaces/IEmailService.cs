using Logistik.Domain.Entities;

namespace Logistik.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendAsync(string to, string subject, string body, CancellationToken ct = default);
    Task QueueAsync(EmailLog emailLog, CancellationToken ct = default);
    Task<bool> SendSavedAsync(EmailLog emailLog, CancellationToken ct = default);
    Task RetryFailedAsync(CancellationToken ct = default);
}
