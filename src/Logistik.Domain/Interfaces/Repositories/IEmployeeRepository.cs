using Logistik.Domain.Entities;

namespace Logistik.Domain.Interfaces.Repositories;

public interface IEmployeeRepository : IRepository<Employee>
{
    Task<(IReadOnlyList<Employee> Items, int Total)> GetPagedAsync(int companyId, int page, int pageSize, string? search, bool includeDeleted = false, CancellationToken ct = default);
    Task<Employee?> GetWithOrdersAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<Employee>> GetEmployeesWithEndingEmploymentAsync(DateOnly from, DateOnly to, CancellationToken ct = default);
    Task<bool> EmbgExistsAsync(string embg, int? excludeId = null, CancellationToken ct = default);
    Task<Employee?> GetByEmbgAsync(string embg, CancellationToken ct = default);
    Task<Employee?> GetWithHistoryAsync(int id, CancellationToken ct = default);
}
