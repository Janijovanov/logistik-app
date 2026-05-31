using Logistik.Application.Common.Interfaces;
using Logistik.Domain.Enums;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Reports.Queries;

public record GetDashboardStatsQuery : IRequest<DashboardStatsDto>;

public record DashboardStatsDto(
    int TotalCompanies,
    int TotalEmployees,
    int ActiveOrders,
    int PendingOrders,
    decimal TotalDeductionsThisMonth,
    int OrdersCompletedThisMonth
);

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public GetDashboardStatsQueryHandler(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken ct)
    {
        var companies = await _uow.Companies.GetAllAsync(ct);
        var accessibleCompanyIds = _currentUser.IsAdmin
            ? companies.Select(c => c.Id).ToList()
            : _currentUser.AssignedCompanyIds;

        var filteredCompanies = companies.Where(c => accessibleCompanyIds.Contains(c.Id)).ToList();

        var employees = await _uow.Employees.GetAllAsync(ct);
        var accessibleEmployees = employees.Where(e => accessibleCompanyIds.Contains(e.CompanyId)).ToList();
        var employeeIds = accessibleEmployees.Select(e => e.Id).ToHashSet();

        var orders = (await _uow.EnforcementOrders.GetAllAsync(ct))
            .Where(o => employeeIds.Contains(o.EmployeeId))
            .ToList();

        var now = DateTime.UtcNow;
        var firstOfMonth = new DateOnly(now.Year, now.Month, 1);

        var salaryHistories = await _uow.SalaryHistories.GetAllAsync(ct);
        var deductionsThisMonth = salaryHistories
            .Where(s => employeeIds.Contains(s.EmployeeId) && s.SalaryMonth == firstOfMonth)
            .Sum(s => s.DeductionAmount);

        var completedThisMonth = orders.Count(o =>
            o.Status == OrderStatus.Completed &&
            o.CompletedDate.HasValue &&
            o.CompletedDate.Value.Year == now.Year &&
            o.CompletedDate.Value.Month == now.Month);

        return new DashboardStatsDto(
            TotalCompanies: filteredCompanies.Count,
            TotalEmployees: accessibleEmployees.Count,
            ActiveOrders: orders.Count(o => o.Status is OrderStatus.Active or OrderStatus.LastInstallment or OrderStatus.Final),
            PendingOrders: orders.Count(o => o.Status == OrderStatus.Queued),
            TotalDeductionsThisMonth: deductionsThisMonth,
            OrdersCompletedThisMonth: completedThisMonth
        );
    }
}
