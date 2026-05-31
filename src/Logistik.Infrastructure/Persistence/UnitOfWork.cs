using Logistik.Domain.Interfaces;
using Logistik.Domain.Interfaces.Repositories;
using Logistik.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace Logistik.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _transaction;

    public IUserRepository Users { get; }
    public ICompanyRepository Companies { get; }
    public IEmployeeRepository Employees { get; }
    public IEnforcementOrderRepository EnforcementOrders { get; }
    public IEnforcementPaymentRepository EnforcementPayments { get; }
    public IEmployeeSalaryHistoryRepository SalaryHistories { get; }
    public IEmailLogRepository EmailLogs { get; }
    public IExecutorRepository Executors { get; }
    public IEmploymentHistoryRepository EmploymentHistories { get; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Users = new UserRepository(context);
        Companies = new CompanyRepository(context);
        Employees = new EmployeeRepository(context);
        EnforcementOrders = new EnforcementOrderRepository(context);
        EnforcementPayments = new EnforcementPaymentRepository(context);
        SalaryHistories = new EmployeeSalaryHistoryRepository(context);
        EmailLogs = new EmailLogRepository(context);
        Executors = new ExecutorRepository(context);
        EmploymentHistories = new EmploymentHistoryRepository(context);
    }

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        => await _context.SaveChangesAsync(ct);

    public async Task BeginTransactionAsync(CancellationToken ct = default)
        => _transaction = await _context.Database.BeginTransactionAsync(ct);

    public async Task CommitTransactionAsync(CancellationToken ct = default)
    {
        if (_transaction is not null)
        {
            await _transaction.CommitAsync(ct);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken ct = default)
    {
        if (_transaction is not null)
        {
            await _transaction.RollbackAsync(ct);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
