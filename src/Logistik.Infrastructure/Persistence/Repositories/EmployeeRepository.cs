using Logistik.Domain.Entities;
using Logistik.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Logistik.Infrastructure.Persistence.Repositories;

public class EmployeeRepository : BaseRepository<Employee>, IEmployeeRepository
{
    public EmployeeRepository(AppDbContext context) : base(context) { }

    public async Task<(IReadOnlyList<Employee> Items, int Total)> GetPagedAsync(int companyId, int page, int pageSize, string? search, bool includeDeleted = false, CancellationToken ct = default)
    {
        var query = _dbSet.IgnoreQueryFilters()
            .Where(e => e.CompanyId == companyId && (includeDeleted || !e.IsDeleted));

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(e => e.FullName.Contains(search) || e.EMBG.Contains(search));

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(e => e.EmploymentEndDate.HasValue ? 1 : 0)
            .ThenBy(e => e.FullName)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return ((IReadOnlyList<Employee>)items, total);
    }

    public async Task<Employee?> GetWithOrdersAsync(int id, CancellationToken ct = default)
        => await _dbSet.IgnoreQueryFilters()
            .Include(e => e.EnforcementOrders)
            .FirstOrDefaultAsync(e => e.Id == id, ct);

    public async Task<IReadOnlyList<Employee>> GetEmployeesWithEndingEmploymentAsync(DateOnly from, DateOnly to, CancellationToken ct = default)
        => await _dbSet.Where(e => e.EmploymentEndDate.HasValue && e.EmploymentEndDate >= from && e.EmploymentEndDate <= to).ToListAsync(ct);

    public async Task<bool> EmbgExistsAsync(string embg, int companyId, int? excludeId = null, CancellationToken ct = default)
        => await _dbSet.IgnoreQueryFilters()
            .AnyAsync(e => e.EMBG == embg && e.CompanyId == companyId && (excludeId == null || e.Id != excludeId), ct);

    public async Task<Employee?> GetByEmbgAsync(string embg, int companyId, CancellationToken ct = default)
        => await _dbSet.IgnoreQueryFilters()
            .FirstOrDefaultAsync(e => e.EMBG == embg && e.CompanyId == companyId, ct); // includes soft-deleted

    public async Task<Employee?> GetWithHistoryAsync(int id, CancellationToken ct = default)
        => await _dbSet.IgnoreQueryFilters()
            .Include(e => e.EmploymentHistories.OrderByDescending(h => h.EndDate))
            .FirstOrDefaultAsync(e => e.Id == id, ct);
}
