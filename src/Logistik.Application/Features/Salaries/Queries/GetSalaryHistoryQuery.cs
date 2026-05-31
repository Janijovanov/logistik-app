using Logistik.Application.Common.Models;
using Logistik.Application.Features.Salaries.DTOs;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Salaries.Queries;

public record GetSalaryHistoryQuery(int EmployeeId, int CompanyId, int Page = 1, int PageSize = 24) : IRequest<PaginatedResult<SalaryHistoryDto>>;

public class GetSalaryHistoryQueryHandler : IRequestHandler<GetSalaryHistoryQuery, PaginatedResult<SalaryHistoryDto>>
{
    private readonly IUnitOfWork _uow;

    public GetSalaryHistoryQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<PaginatedResult<SalaryHistoryDto>> Handle(GetSalaryHistoryQuery request, CancellationToken ct)
    {
        var items = await _uow.SalaryHistories.GetByEmployeeAsync(request.EmployeeId, request.Page, request.PageSize, ct);
        var total = await _uow.SalaryHistories.GetTotalByEmployeeAsync(request.EmployeeId, ct);

        return new PaginatedResult<SalaryHistoryDto>
        {
            Items = items.Select(s =>
            {
                var payment = s.Payments.FirstOrDefault();
                var isFirst = payment is not null && s.EnforcementOrder is not null &&
                    payment.RemainingAfterPayment + payment.AmountPaid == s.EnforcementOrder.TotalAmount;
                return new SalaryHistoryDto(
                    s.Id, s.EmployeeId, s.SalaryMonth,
                    s.NetSalary, s.DeductionAmount,
                    s.EnforcementOrderId, s.EnforcementOrder?.OrderNumber, s.EnforcementOrder?.ExecutorName,
                    s.OverflowDeductionAmount, s.OverflowEnforcementOrderId,
                    s.OverflowEnforcementOrder?.OrderNumber, s.OverflowEnforcementOrder?.ExecutorName,
                    s.Notes, s.RecordedAt, s.RecordedBy?.Username ?? "",
                    payment?.RemainingAfterPayment, isFirst);
            }).ToList(),
            TotalCount = total,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
