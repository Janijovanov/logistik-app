using Logistik.Application.Common.Models;
using Logistik.Application.Features.Employees.DTOs;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Employees.Queries;

public record GetEmployeesQuery(int CompanyId, int Page = 1, int PageSize = 20, string? Search = null, bool IncludeDeleted = false) : IRequest<PaginatedResult<EmployeeDto>>;

public class GetEmployeesQueryHandler : IRequestHandler<GetEmployeesQuery, PaginatedResult<EmployeeDto>>
{
    private readonly IUnitOfWork _uow;

    public GetEmployeesQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<PaginatedResult<EmployeeDto>> Handle(GetEmployeesQuery request, CancellationToken ct)
    {
        var (items, total) = await _uow.Employees.GetPagedAsync(
            request.CompanyId, request.Page, request.PageSize, request.Search, request.IncludeDeleted, ct);

        return new PaginatedResult<EmployeeDto>
        {
            Items = items.Select(e => new EmployeeDto(e.Id, e.CompanyId, e.FullName, e.EMBG,
                e.EmploymentStartDate, e.EmploymentEndDate, e.BankAccount, e.NetSalary, e.IsDeleted, Code: e.Code)).ToList(),
            TotalCount = total,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
