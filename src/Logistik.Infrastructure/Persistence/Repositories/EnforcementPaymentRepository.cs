using Logistik.Domain.Entities;
using Logistik.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Logistik.Infrastructure.Persistence.Repositories;

public class EnforcementPaymentRepository : BaseRepository<EnforcementPayment>, IEnforcementPaymentRepository
{
    public EnforcementPaymentRepository(AppDbContext context) : base(context) { }

    public async Task<IReadOnlyList<EnforcementPayment>> GetByOrderIdAsync(int orderId, CancellationToken ct = default)
        => await _dbSet.Where(p => p.EnforcementOrderId == orderId)
            .OrderBy(p => p.PaymentMonth).ToListAsync(ct);
}
