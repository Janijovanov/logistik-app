using Logistik.Domain.Entities;

namespace Logistik.Domain.Interfaces.Repositories;

public interface IEmployeeRepository : IRepository<Employee>
{
    Task<(IReadOnlyList<Employee> Items, int Total)> GetPagedAsync(int companyId, int page, int pageSize, string? search, bool includeDeleted = false, CancellationToken ct = default);
    Task<Employee?> GetWithOrdersAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<Employee>> GetEmployeesWithEndingEmploymentAsync(DateOnly from, DateOnly to, CancellationToken ct = default);
    /// <summary>Returns true if another employee in the same company already has this EMBG.</summary>
    Task<bool> EmbgExistsAsync(string embg, int companyId, int? excludeId = null, CancellationToken ct = default);
    /// <summary>Returns true if another active employee in the same company already has this code.</summary>
    Task<bool> CodeExistsAsync(string code, int companyId, int? excludeId = null, CancellationToken ct = default);
    /// <summary>Finds a non-deleted employee with this EMBG in the given company (for re-hire detection).</summary>
    Task<Employee?> GetByEmbgAsync(string embg, int companyId, CancellationToken ct = default);
    Task<Employee?> GetWithHistoryAsync(int id, CancellationToken ct = default);
}
