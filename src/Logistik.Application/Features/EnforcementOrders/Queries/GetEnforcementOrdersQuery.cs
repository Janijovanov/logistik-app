using Logistik.Application.Features.EnforcementOrders.DTOs;
using Logistik.Domain.Enums;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.EnforcementOrders.Queries;

public record GetEnforcementOrdersQuery(int EmployeeId, int CompanyId, bool IncludeArchived = false) : IRequest<IReadOnlyList<EnforcementOrderDto>>;

public class GetEnforcementOrdersQueryHandler : IRequestHandler<GetEnforcementOrdersQuery, IReadOnlyList<EnforcementOrderDto>>
{
    private readonly IUnitOfWork _uow;

    public GetEnforcementOrdersQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IReadOnlyList<EnforcementOrderDto>> Handle(GetEnforcementOrdersQuery request, CancellationToken ct)
    {
        var orders = await _uow.EnforcementOrders.GetOrdersForEmployeeAsync(request.EmployeeId, request.IncludeArchived, ct);
        return orders.Select(o => new EnforcementOrderDto(
            o.Id, o.EmployeeId, o.OrderNumber,
            o.ExecutorName, o.ExecutorEmail, o.ExecutorBankAccount,
            o.TotalAmount, o.MonthlyDeduction, o.TotalPaid, o.RemainingAmount,
            NormalizeStatus(o), o.QueuePosition,
            o.ReceivedDate, o.CompletedDate, o.IsArchived,
            GetStatusColor(o))).ToList();
    }

    // Corrects stale LastInstallment status in DB without requiring a migration.
    // LastInstallment is only valid when remaining <= monthly; otherwise treat as Active.
    // With nullable MonthlyDeduction (auto mode), we trust the stored status.
    private static OrderStatus NormalizeStatus(Domain.Entities.EnforcementOrder o)
    {
        if (o.MonthlyDeduction.HasValue && o.Status == OrderStatus.LastInstallment && o.RemainingAmount > o.MonthlyDeduction.Value)
            return OrderStatus.Active;
        return o.Status;
    }

    private static string GetStatusColor(Domain.Entities.EnforcementOrder o)
    {
        if (o.IsArchived || o.Status == OrderStatus.Completed || o.Status == OrderStatus.Archived)
            return "green";
        if (o.RemainingAmount > 0 && o.MonthlyDeduction.HasValue && o.RemainingAmount <= o.MonthlyDeduction.Value)
            return "yellow";
        return "default";
    }
}
