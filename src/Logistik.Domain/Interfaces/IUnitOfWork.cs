using Logistik.Domain.Interfaces.Repositories;

namespace Logistik.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    ICompanyRepository Companies { get; }
    IEmployeeRepository Employees { get; }
    IEnforcementOrderRepository EnforcementOrders { get; }
    IEnforcementPaymentRepository EnforcementPayments { get; }
    IEmployeeSalaryHistoryRepository SalaryHistories { get; }
    IEmailLogRepository EmailLogs { get; }
    IExecutorRepository Executors { get; }
    IEmploymentHistoryRepository EmploymentHistories { get; }

    Task<int> SaveChangesAsync(CancellationToken ct = default);
    Task BeginTransactionAsync(CancellationToken ct = default);
    Task CommitTransactionAsync(CancellationToken ct = default);
    Task RollbackTransactionAsync(CancellationToken ct = default);
}
