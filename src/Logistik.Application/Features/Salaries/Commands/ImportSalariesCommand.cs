using Logistik.Application.Common.Interfaces;
using Logistik.Application.Common.Models;
using Logistik.Domain.Entities;
using Logistik.Domain.Enums;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Salaries.Commands;

public record ExcelSalaryRow(string EMBG, string FullName, decimal NetSalary);

public record ImportSalariesResult(int Imported, int AlreadyRecorded, List<string> NotFound);

public record ImportSalariesCommand(
    int CompanyId,
    DateOnly SalaryMonth,
    IReadOnlyList<ExcelSalaryRow> Rows
) : IRequest<Result<ImportSalariesResult>>;

public class ImportSalariesCommandHandler : IRequestHandler<ImportSalariesCommand, Result<ImportSalariesResult>>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public ImportSalariesCommandHandler(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    public async Task<Result<ImportSalariesResult>> Handle(ImportSalariesCommand request, CancellationToken ct)
    {
        int imported = 0;
        int alreadyRecorded = 0;
        var notFound = new List<string>();

        foreach (var row in request.Rows)
        {
            var employee = await _uow.Employees.GetByEmbgAsync(row.EMBG, request.CompanyId, ct);
            if (employee is null)
            {
                notFound.Add(row.FullName.Trim().Length > 0 ? $"{row.FullName} (ЕМБГ: {row.EMBG})" : row.EMBG);
                continue;
            }

            var existing = await _uow.SalaryHistories.GetByEmployeeAndMonthAsync(employee.Id, request.SalaryMonth, ct);
            if (existing is not null)
            {
                alreadyRecorded++;
                continue;
            }

            var activeOrder = await _uow.EnforcementOrders.GetActiveOrderForEmployeeAsync(employee.Id, ct);

            if (activeOrder is not null && request.SalaryMonth >= activeOrder.ReceivedDate)
            {
                var monthlyDeduction = activeOrder.MonthlyDeduction ?? Math.Round(row.NetSalary / 5m, 2);
                var deductionAmount = Math.Min(monthlyDeduction, activeOrder.RemainingAmount);

                var salaryRecord = new EmployeeSalaryHistory
                {
                    EmployeeId = employee.Id,
                    SalaryMonth = request.SalaryMonth,
                    NetSalary = row.NetSalary,
                    DeductionAmount = deductionAmount,
                    EnforcementOrderId = activeOrder.Id,
                    Notes = "Увоз од Excel",
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
                activeOrder.RecalculateStatus(monthlyDeduction);
                activeOrder.UpdatedAt = DateTime.UtcNow;

                if (activeOrder.RemainingAmount <= 0)
                {
                    activeOrder.Status = OrderStatus.Completed;
                    activeOrder.IsArchived = true;
                    activeOrder.CompletedDate = DateOnly.FromDateTime(DateTime.UtcNow);

                    var queuedOrders = await _uow.EnforcementOrders.GetQueuedOrdersForEmployeeAsync(employee.Id, ct);
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
            }
            else
            {
                var salaryRecord = new EmployeeSalaryHistory
                {
                    EmployeeId = employee.Id,
                    SalaryMonth = request.SalaryMonth,
                    NetSalary = row.NetSalary,
                    DeductionAmount = 0,
                    Notes = "Увоз од Excel",
                    RecordedByUserId = _currentUser.UserId
                };

                await _uow.SalaryHistories.AddAsync(salaryRecord, ct);
                await _uow.SaveChangesAsync(ct);
            }

            imported++;
        }

        return Result<ImportSalariesResult>.Success(new ImportSalariesResult(imported, alreadyRecorded, notFound));
    }
}
