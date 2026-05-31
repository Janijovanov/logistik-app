using Logistik.Application.Common.Models;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Salaries.Commands;

public record UpdateSalaryCommand(int RecordId, int EmployeeId, int CompanyId, decimal NetSalary, string? Notes) : IRequest<Result>;

public class UpdateSalaryCommandHandler : IRequestHandler<UpdateSalaryCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public UpdateSalaryCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(UpdateSalaryCommand request, CancellationToken ct)
    {
        var record = await _uow.SalaryHistories.GetByIdAsync(request.RecordId, ct)
            ?? throw new NotFoundException("SalaryRecord", request.RecordId);

        if (record.EmployeeId != request.EmployeeId)
            return Result.Failure("Salary record does not belong to this employee.");

        var employee = await _uow.Employees.GetByIdAsync(request.EmployeeId, ct)
            ?? throw new NotFoundException("Employee", request.EmployeeId);

        if (employee.CompanyId != request.CompanyId)
            return Result.Failure("Employee does not belong to this company.");

        record.NetSalary = request.NetSalary;
        record.Notes = request.Notes;
        record.UpdatedAt = DateTime.UtcNow;

        _uow.SalaryHistories.Update(record);
        await _uow.SaveChangesAsync(ct);

        return Result.Success();
    }
}
