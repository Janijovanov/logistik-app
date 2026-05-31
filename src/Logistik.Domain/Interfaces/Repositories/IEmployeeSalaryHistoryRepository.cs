using Logistik.Domain.Entities;

namespace Logistik.Domain.Interfaces.Repositories;

public interface IEmployeeSalaryHistoryRepository : IRepository<EmployeeSalaryHistory>
{
    Task<EmployeeSalaryHistory?> GetByEmployeeAndMonthAsync(int employeeId, DateOnly month, CancellationToken ct = default);
    Task<IReadOnlyList<EmployeeSalaryHistory>> GetByEmployeeAsync(int employeeId, int page, int pageSize, CancellationToken ct = default);
    Task<int> GetTotalByEmployeeAsync(int employeeId, CancellationToken ct = default);
    Task<IReadOnlyList<EmployeeSalaryHistory>> GetByCompanyAndMonthAsync(int companyId, DateOnly month, CancellationToken ct = default);
    Task<EmployeeSalaryHistory?> GetForPaymentOrderAsync(int id, CancellationToken ct = default);
}
