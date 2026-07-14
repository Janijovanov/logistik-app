using Logistik.Application.Features.Employees.DTOs;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Employees.Queries;

public record GetEmployeeByIdQuery(int CompanyId, int Id) : IRequest<EmployeeDto>;

public class GetEmployeeByIdQueryHandler : IRequestHandler<GetEmployeeByIdQuery, EmployeeDto>
{
    private readonly IUnitOfWork _uow;
    public GetEmployeeByIdQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<EmployeeDto> Handle(GetEmployeeByIdQuery request, CancellationToken ct)
    {
        var e = await _uow.Employees.GetWithHistoryAsync(request.Id, ct)
            ?? throw new NotFoundException("Employee", request.Id);
        if (e.CompanyId != request.CompanyId)
            throw new NotFoundException("Employee", request.Id);

        var histories = e.EmploymentHistories
            .OrderByDescending(h => h.EndDate)
            .Select(h => new EmploymentHistoryDto(h.Id, h.StartDate, h.EndDate))
            .ToList();

        return new EmployeeDto(e.Id, e.CompanyId, e.FullName, e.EMBG,
            e.EmploymentStartDate, e.EmploymentEndDate, e.BankAccount, e.NetSalary, e.IsDeleted,
            histories, Code: e.Code);
    }
}
