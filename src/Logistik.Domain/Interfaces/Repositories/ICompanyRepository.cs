using Logistik.Domain.Entities;

namespace Logistik.Domain.Interfaces.Repositories;

public interface ICompanyRepository : IRepository<Company>
{
    Task<(IReadOnlyList<Company> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search, IEnumerable<int>? allowedIds = null, CancellationToken ct = default);
    Task<bool> TaxNumberExistsAsync(string taxNumber, int? excludeId = null, CancellationToken ct = default);
    Task<bool> RegistrationNumberExistsAsync(string regNumber, int? excludeId = null, CancellationToken ct = default);
}
