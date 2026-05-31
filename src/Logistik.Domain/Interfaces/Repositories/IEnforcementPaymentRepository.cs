using Logistik.Domain.Entities;

namespace Logistik.Domain.Interfaces.Repositories;

public interface IEnforcementPaymentRepository : IRepository<EnforcementPayment>
{
    Task<IReadOnlyList<EnforcementPayment>> GetByOrderIdAsync(int orderId, CancellationToken ct = default);
}
