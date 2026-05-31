using Logistik.Application.Common.Models;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Employees.Commands;

public record SoftDeleteEmployeeCommand(int Id, int CompanyId) : IRequest<Result>;

public class SoftDeleteEmployeeCommandHandler : IRequestHandler<SoftDeleteEmployeeCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public SoftDeleteEmployeeCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(SoftDeleteEmployeeCommand request, CancellationToken ct)
    {
        var employee = await _uow.Employees.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException("Employee", request.Id);

        if (employee.CompanyId != request.CompanyId)
            return Result.Failure("Employee does not belong to this company.");

        employee.IsDeleted = true;
        employee.DeletedAt = DateTime.UtcNow;
        _uow.Employees.Update(employee);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
