using Logistik.Domain.Entities;
using Logistik.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Logistik.Infrastructure.Persistence.Repositories;

public class EmployeeSalaryHistoryRepository : BaseRepository<EmployeeSalaryHistory>, IEmployeeSalaryHistoryRepository
{
    public EmployeeSalaryHistoryRepository(AppDbContext context) : base(context) { }

    public async Task<EmployeeSalaryHistory?> GetByEmployeeAndMonthAsync(int employeeId, DateOnly month, CancellationToken ct = default)
        => await _dbSet.FirstOrDefaultAsync(s => s.EmployeeId == employeeId && s.SalaryMonth == month, ct);

    public async Task<IReadOnlyList<EmployeeSalaryHistory>> GetByEmployeeAsync(int employeeId, int page, int pageSize, CancellationToken ct = default)
        => await _dbSet.Where(s => s.EmployeeId == employeeId)
            .Include(s => s.EnforcementOrder)
            .Include(s => s.OverflowEnforcementOrder)
            .Include(s => s.RecordedBy)
            .Include(s => s.Payments)
            .OrderByDescending(s => s.SalaryMonth)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);

    public async Task<int> GetTotalByEmployeeAsync(int employeeId, CancellationToken ct = default)
        => await _dbSet.CountAsync(s => s.EmployeeId == employeeId, ct);

    public async Task<IReadOnlyList<EmployeeSalaryHistory>> GetByCompanyAndMonthAsync(int companyId, DateOnly month, CancellationToken ct = default)
        => await _dbSet
            .Include(s => s.Employee)
            .Include(s => s.EnforcementOrder)
            .Where(s => s.Employee.CompanyId == companyId && s.SalaryMonth == month && !s.Employee.IsDeleted)
            .ToListAsync(ct);

    public async Task<EmployeeSalaryHistory?> GetForPaymentOrderAsync(int id, CancellationToken ct = default)
        => await _dbSet
            .Include(s => s.Employee).ThenInclude(e => e.Company)
            .Include(s => s.EnforcementOrder)
            .Include(s => s.OverflowEnforcementOrder)
            .FirstOrDefaultAsync(s => s.Id == id, ct);
}
