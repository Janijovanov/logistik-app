using Logistik.Domain.Entities;
using Logistik.Domain.Enums;

namespace Logistik.Domain.Interfaces.Repositories;

public interface IEnforcementOrderRepository : IRepository<EnforcementOrder>
{
    Task<EnforcementOrder?> GetActiveOrderForEmployeeAsync(int employeeId, CancellationToken ct = default);
    Task<IReadOnlyList<EnforcementOrder>> GetOrdersForEmployeeAsync(int employeeId, bool includeArchived = false, CancellationToken ct = default);
    Task<IReadOnlyList<EnforcementOrder>> GetQueuedOrdersForEmployeeAsync(int employeeId, CancellationToken ct = default);
    Task<int> GetMaxQueuePositionAsync(int employeeId, CancellationToken ct = default);
    Task<IReadOnlyList<EnforcementOrder>> GetAllActiveOrdersAsync(CancellationToken ct = default);
    Task<EnforcementOrder?> GetWithPaymentsAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<EnforcementOrder>> GetActiveOrdersForCompanyAsync(int companyId, CancellationToken ct = default);
    Task<EnforcementOrder?> GetWithDetailsAsync(int id, CancellationToken ct = default);
    Task<bool> OrderNumberExistsAsync(string orderNumber, int? excludeId = null, CancellationToken ct = default);
}
