using Logistik.Application.Features.Employees.DTOs;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Employees.Queries;

public record GetEmployeesMonthlySalaryQuery(int CompanyId, int Year, int Month) : IRequest<IReadOnlyList<EmployeeMonthlySalaryDto>>;

public class GetEmployeesMonthlySalaryQueryHandler : IRequestHandler<GetEmployeesMonthlySalaryQuery, IReadOnlyList<EmployeeMonthlySalaryDto>>
{
    private readonly IUnitOfWork _uow;
    public GetEmployeesMonthlySalaryQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IReadOnlyList<EmployeeMonthlySalaryDto>> Handle(GetEmployeesMonthlySalaryQuery request, CancellationToken ct)
    {
        var month = new DateOnly(request.Year, request.Month, 1);

        var (employees, _) = await _uow.Employees.GetPagedAsync(request.CompanyId, 1, 1000, null, false, ct);
        var salaries = await _uow.SalaryHistories.GetByCompanyAndMonthAsync(request.CompanyId, month, ct);
        var activeOrders = await _uow.EnforcementOrders.GetActiveOrdersForCompanyAsync(request.CompanyId, ct);

        var salaryLookup = salaries.ToDictionary(s => s.EmployeeId);
        var activeOrderLookup = activeOrders.ToDictionary(o => o.EmployeeId);

        return employees
            .OrderBy(e => e.EmploymentEndDate.HasValue ? 1 : 0)
            .ThenBy(e => e.FullName)
            .Select(e =>
            {
                salaryLookup.TryGetValue(e.Id, out var sal);
                // Use order from salary record if recorded, otherwise fall back to current active order
                var order = sal?.EnforcementOrder;
                if (order is null) activeOrderLookup.TryGetValue(e.Id, out order);

                return new EmployeeMonthlySalaryDto(
                    e.Id, e.CompanyId, e.FullName, e.EMBG,
                    e.EmploymentStartDate, e.EmploymentEndDate,
                    e.BankAccount, e.NetSalary,
                    sal?.Id, sal?.NetSalary, sal?.DeductionAmount,
                    order?.ExecutorName, order?.ExecutorBankAccount, order?.OrderNumber,
                    Code: e.Code);
            }).ToList();
    }
}
