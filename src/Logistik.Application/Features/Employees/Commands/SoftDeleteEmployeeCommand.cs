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

        // Block deletion while the employee still has enforcement orders —
        // those must be deleted first so no orders are left orphaned.
        var orders = await _uow.EnforcementOrders.GetOrdersForEmployeeAsync(request.Id, includeArchived: true, ct);
        if (orders.Count > 0)
            return Result.Failure(
                $"Вработениот има {orders.Count} извршно решение(ја). Прво избришете ги извршните решенија, па потоа вработениот.");

        employee.IsDeleted = true;
        employee.DeletedAt = DateTime.UtcNow;
        _uow.Employees.Update(employee);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
