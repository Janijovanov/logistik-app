using Logistik.Application.Common.Models;
using Logistik.Domain.Enums;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.EnforcementOrders.Commands;

public record MarkOrderPaidCommand(int OrderId, int EmployeeId, int CompanyId) : IRequest<Result>;

public class MarkOrderPaidCommandHandler : IRequestHandler<MarkOrderPaidCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public MarkOrderPaidCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(MarkOrderPaidCommand request, CancellationToken ct)
    {
        var order = await _uow.EnforcementOrders.GetByIdAsync(request.OrderId, ct)
            ?? throw new NotFoundException("EnforcementOrder", request.OrderId);

        if (order.EmployeeId != request.EmployeeId)
            return Result.Failure("Order does not belong to this employee.");

        var employee = await _uow.Employees.GetByIdAsync(order.EmployeeId, ct)
            ?? throw new NotFoundException("Employee", order.EmployeeId);

        if (employee.CompanyId != request.CompanyId)
            return Result.Failure("Employee does not belong to this company.");

        if (order.Status != OrderStatus.Final && order.RemainingAmount > 0)
            return Result.Failure("Order is not in Final status.");

        order.Status = OrderStatus.Completed;
        order.IsArchived = true;
        order.CompletedDate = DateOnly.FromDateTime(DateTime.UtcNow);
        order.UpdatedAt = DateTime.UtcNow;
        _uow.EnforcementOrders.Update(order);

        var queuedOrders = await _uow.EnforcementOrders.GetQueuedOrdersForEmployeeAsync(request.EmployeeId, ct);
        var nextOrder = queuedOrders.OrderBy(o => o.QueuePosition).FirstOrDefault();
        if (nextOrder is not null)
        {
            nextOrder.Status = OrderStatus.Active;
            nextOrder.QueuePosition = 0;
            nextOrder.UpdatedAt = DateTime.UtcNow;
            _uow.EnforcementOrders.Update(nextOrder);

            int pos = 1;
            foreach (var queued in queuedOrders.Where(o => o.Id != nextOrder.Id).OrderBy(o => o.QueuePosition))
            {
                queued.QueuePosition = pos++;
                _uow.EnforcementOrders.Update(queued);
            }
        }

        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
