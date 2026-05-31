using Logistik.Domain.Entities;
using Logistik.Domain.Enums;
using Logistik.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Logistik.Infrastructure.Persistence.Repositories;

public class EnforcementOrderRepository : BaseRepository<EnforcementOrder>, IEnforcementOrderRepository
{
    public EnforcementOrderRepository(AppDbContext context) : base(context) { }

    public async Task<EnforcementOrder?> GetActiveOrderForEmployeeAsync(int employeeId, CancellationToken ct = default)
        => await _dbSet.FirstOrDefaultAsync(o =>
            o.EmployeeId == employeeId &&
            (o.Status == OrderStatus.Active || o.Status == OrderStatus.LastInstallment || o.Status == OrderStatus.Final), ct);

    public async Task<IReadOnlyList<EnforcementOrder>> GetOrdersForEmployeeAsync(int employeeId, bool includeArchived = false, CancellationToken ct = default)
    {
        var query = _dbSet.Where(o => o.EmployeeId == employeeId);
        if (!includeArchived)
            query = query.Where(o => !o.IsArchived);
        return await query.OrderBy(o => o.QueuePosition).ThenBy(o => o.ReceivedDate).ToListAsync(ct);
    }

    public async Task<IReadOnlyList<EnforcementOrder>> GetQueuedOrdersForEmployeeAsync(int employeeId, CancellationToken ct = default)
        => await _dbSet.Where(o => o.EmployeeId == employeeId && o.Status == OrderStatus.Queued)
            .OrderBy(o => o.QueuePosition).ToListAsync(ct);

    public async Task<int> GetMaxQueuePositionAsync(int employeeId, CancellationToken ct = default)
    {
        var max = await _dbSet.Where(o => o.EmployeeId == employeeId && !o.IsArchived)
            .MaxAsync(o => (int?)o.QueuePosition, ct);
        return max ?? 0;
    }

    public async Task<IReadOnlyList<EnforcementOrder>> GetAllActiveOrdersAsync(CancellationToken ct = default)
        => await _dbSet.Where(o => o.Status == OrderStatus.Active || o.Status == OrderStatus.LastInstallment || o.Status == OrderStatus.Final)
            .Include(o => o.Employee).ToListAsync(ct);

    public async Task<EnforcementOrder?> GetWithPaymentsAsync(int id, CancellationToken ct = default)
        => await _dbSet.Include(o => o.Payments).FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task<IReadOnlyList<EnforcementOrder>> GetActiveOrdersForCompanyAsync(int companyId, CancellationToken ct = default)
        => await _dbSet
            .Where(o => o.Employee.CompanyId == companyId && !o.IsArchived &&
                (o.Status == OrderStatus.Active || o.Status == OrderStatus.LastInstallment || o.Status == OrderStatus.Final))
            .ToListAsync(ct);

    public async Task<EnforcementOrder?> GetWithDetailsAsync(int id, CancellationToken ct = default)
        => await _dbSet
            .IgnoreQueryFilters()
            .Include(o => o.Employee).ThenInclude(e => e.Company)
            .FirstOrDefaultAsync(o => o.Id == id, ct);
}
