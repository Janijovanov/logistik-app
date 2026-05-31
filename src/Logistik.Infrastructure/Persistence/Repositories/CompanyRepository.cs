using Logistik.Domain.Entities;
using Logistik.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Logistik.Infrastructure.Persistence.Repositories;

public class CompanyRepository : BaseRepository<Company>, ICompanyRepository
{
    public CompanyRepository(AppDbContext context) : base(context) { }

    public async Task<(IReadOnlyList<Company> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search, IEnumerable<int>? allowedIds = null, CancellationToken ct = default)
    {
        var query = _dbSet.Where(c => c.IsActive).AsQueryable();

        if (allowedIds is not null)
            query = query.Where(c => allowedIds.Contains(c.Id));

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(c => c.Name.Contains(search) || c.TaxNumber.Contains(search) || c.RegistrationNumber.Contains(search));

        var total = await query.CountAsync(ct);
        var items = await query.OrderBy(c => c.Name).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return ((IReadOnlyList<Company>)items, total);
    }

    public async Task<bool> TaxNumberExistsAsync(string taxNumber, int? excludeId = null, CancellationToken ct = default)
        => await _dbSet.AnyAsync(c => c.TaxNumber == taxNumber && (excludeId == null || c.Id != excludeId), ct);

    public async Task<bool> RegistrationNumberExistsAsync(string regNumber, int? excludeId = null, CancellationToken ct = default)
        => await _dbSet.AnyAsync(c => c.RegistrationNumber == regNumber && (excludeId == null || c.Id != excludeId), ct);
}
