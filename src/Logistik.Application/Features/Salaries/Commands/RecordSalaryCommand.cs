using Logistik.Application.Common.Interfaces;
using Logistik.Application.Common.Models;
using Logistik.Domain.Entities;
using Logistik.Domain.Enums;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Salaries.Commands;

public record RecordSalaryCommand(int EmployeeId, int CompanyId, DateOnly SalaryMonth, decimal NetSalary, string? Notes) : IRequest<Result<int>>;

public class RecordSalaryCommandHandler : IRequestHandler<RecordSalaryCommand, Result<int>>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public RecordSalaryCommandHandler(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    public async Task<Result<int>> Handle(RecordSalaryCommand request, CancellationToken ct)
    {
        var employee = await _uow.Employees.GetByIdAsync(request.EmployeeId, ct)
            ?? throw new NotFoundException("Employee", request.EmployeeId);

        if (employee.CompanyId != request.CompanyId)
            return Result<int>.Failure("Employee does not belong to this company.");

        var existing = await _uow.SalaryHistories.GetByEmployeeAndMonthAsync(request.EmployeeId, request.SalaryMonth, ct);
        if (existing is not null)
            return Result<int>.Failure($"Salary for {request.SalaryMonth:yyyy-MM} already recorded.");

        var activeOrder = await _uow.EnforcementOrders.GetActiveOrderForEmployeeAsync(request.EmployeeId, ct);

        decimal deductionAmount = 0;
        int? orderId = null;

        if (activeOrder is not null && request.SalaryMonth >= activeOrder.ReceivedDate)
        {
            var monthlyDeduction = Math.Round(request.NetSalary / 5m, 2);
            deductionAmount = Math.Min(monthlyDeduction, activeOrder.RemainingAmount);
            orderId = activeOrder.Id;

            var salaryRecord = new EmployeeSalaryHistory
            {
                EmployeeId = request.EmployeeId,
                SalaryMonth = request.SalaryMonth,
                NetSalary = request.NetSalary,
                DeductionAmount = deductionAmount,
                EnforcementOrderId = orderId,
                Notes = request.Notes,
                RecordedByUserId = _currentUser.UserId
            };

            await _uow.SalaryHistories.AddAsync(salaryRecord, ct);
            await _uow.SaveChangesAsync(ct);

            var payment = new EnforcementPayment
            {
                EnforcementOrderId = activeOrder.Id,
                SalaryHistoryId = salaryRecord.Id,
                PaymentMonth = request.SalaryMonth,
                AmountPaid = deductionAmount,
                RemainingAfterPayment = activeOrder.RemainingAmount - deductionAmount,
                PaymentStatus = activeOrder.Status
            };
            await _uow.EnforcementPayments.AddAsync(payment, ct);

            activeOrder.TotalPaid += deductionAmount;
            activeOrder.RemainingAmount -= deductionAmount;
            activeOrder.RecalculateStatus();
            activeOrder.UpdatedAt = DateTime.UtcNow;

            if (activeOrder.RemainingAmount <= 0)
            {
                activeOrder.Status = OrderStatus.Completed;
                activeOrder.IsArchived = true;
                activeOrder.CompletedDate = DateOnly.FromDateTime(DateTime.UtcNow);

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

                    // Split payment: leftover monthly capacity flows to the next order in the same month.
                    var overflow = monthlyDeduction - deductionAmount;
                    if (overflow > 0)
                    {
                        var overflowAmount = Math.Min(overflow, nextOrder.RemainingAmount);
                        var overflowPayment = new EnforcementPayment
                        {
                            EnforcementOrderId = nextOrder.Id,
                            SalaryHistoryId = salaryRecord.Id,
                            PaymentMonth = request.SalaryMonth,
                            AmountPaid = overflowAmount,
                            RemainingAfterPayment = nextOrder.RemainingAmount - overflowAmount,
                            PaymentStatus = nextOrder.Status
                        };
                        await _uow.EnforcementPayments.AddAsync(overflowPayment, ct);

                        nextOrder.TotalPaid += overflowAmount;
                        nextOrder.RemainingAmount -= overflowAmount;
                        nextOrder.RecalculateStatus();
                        nextOrder.UpdatedAt = DateTime.UtcNow;
                        _uow.EnforcementOrders.Update(nextOrder);

                        salaryRecord.OverflowDeductionAmount = overflowAmount;
                        salaryRecord.OverflowEnforcementOrderId = nextOrder.Id;
                        _uow.SalaryHistories.Update(salaryRecord);
                    }
                }
            }

            _uow.EnforcementOrders.Update(activeOrder);

            await _uow.SaveChangesAsync(ct);
            return Result<int>.Success(salaryRecord.Id);
        }
        else
        {
            var salaryRecord = new EmployeeSalaryHistory
            {
                EmployeeId = request.EmployeeId,
                SalaryMonth = request.SalaryMonth,
                NetSalary = request.NetSalary,
                DeductionAmount = 0,
                Notes = request.Notes,
                RecordedByUserId = _currentUser.UserId
            };

            await _uow.SalaryHistories.AddAsync(salaryRecord, ct);
            await _uow.SaveChangesAsync(ct);
            return Result<int>.Success(salaryRecord.Id);
        }
    }
}
