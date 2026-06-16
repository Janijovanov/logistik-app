using Logistik.Application.Common.Interfaces;
using Logistik.Application.Common.Models;
using Logistik.Domain.Entities;
using Logistik.Domain.Enums;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.EnforcementOrders.Commands;

public record CreateEnforcementOrderCommand(
    int EmployeeId, int CompanyId,
    string OrderNumber, string ExecutorName, string ExecutorEmail, string ExecutorBankAccount,
    decimal TotalAmount, decimal? MonthlyDeductionOverride, DateOnly ReceivedDate) : IRequest<Result<int>>;

public class CreateEnforcementOrderCommandHandler : IRequestHandler<CreateEnforcementOrderCommand, Result<int>>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;
    private readonly IEmailService _email;

    public CreateEnforcementOrderCommandHandler(IUnitOfWork uow, ICurrentUserService currentUser, IEmailService email)
    {
        _uow = uow;
        _currentUser = currentUser;
        _email = email;
    }

    public async Task<Result<int>> Handle(CreateEnforcementOrderCommand request, CancellationToken ct)
    {
        var employee = await _uow.Employees.GetByIdAsync(request.EmployeeId, ct)
            ?? throw new NotFoundException("Employee", request.EmployeeId);

        if (employee.CompanyId != request.CompanyId)
            return Result<int>.Failure("Employee does not belong to this company.");

        var activeOrder = await _uow.EnforcementOrders.GetActiveOrderForEmployeeAsync(request.EmployeeId, ct);
        var maxQueue = await _uow.EnforcementOrders.GetMaxQueuePositionAsync(request.EmployeeId, ct);

        var order = new EnforcementOrder
        {
            EmployeeId = request.EmployeeId,
            OrderNumber = request.OrderNumber,
            ExecutorName = request.ExecutorName,
            ExecutorEmail = request.ExecutorEmail,
            ExecutorBankAccount = request.ExecutorBankAccount,
            TotalAmount = request.TotalAmount,
            // null = auto mode: deduction is 1/5 of the salary entered each month
            MonthlyDeduction = request.MonthlyDeductionOverride,
            RemainingAmount = request.TotalAmount,
            ReceivedDate = request.ReceivedDate,
            CreatedByUserId = _currentUser.UserId
        };

        if (activeOrder is null)
        {
            order.Status = OrderStatus.Active;
            order.QueuePosition = 0;
        }
        else
        {
            order.Status = OrderStatus.Queued;
            order.QueuePosition = maxQueue + 1;
        }

        await _uow.EnforcementOrders.AddAsync(order, ct);
        await _uow.SaveChangesAsync(ct);

        var company = await _uow.Companies.GetByIdAsync(employee.CompanyId, ct);
        var currentUser = await _uow.Users.GetByIdAsync(_currentUser.UserId, ct);
        var senderName = currentUser is not null
            ? $"{currentUser.FirstName} {currentUser.LastName}".Trim()
            : _currentUser.Username;
        var companyName = company?.Name ?? "Логистик";
        var salary = employee.NetSalary.ToString("N2") + " ден.";

        EmailLog emailLog;

        if (activeOrder is null)
        {
            emailLog = new EmailLog
            {
                RecipientEmail = request.ExecutorEmail,
                Subject = $"Известување — Извршно решение И.бр. {request.OrderNumber} — {employee.FullName}",
                Body = BuildEmailBody(
                    $"Лицето <strong>{employee.FullName}</strong> со ЕМБГ <strong>{employee.EMBG}</strong> " +
                    $"вработено во <strong>{companyName}</strong> за кое имате извршно решение " +
                    $"<strong>И.бр. {request.OrderNumber}</strong> има месечни примања во износ од " +
                    $"<strong>{salary}</strong> и нема други задршки од извршители.",
                    senderName),
                NotificationType = EmailNotificationType.NewOrderQueued,
                RelatedEntityType = "EnforcementOrder",
                RelatedEntityId = order.Id
            };
        }
        else
        {
            emailLog = new EmailLog
            {
                RecipientEmail = request.ExecutorEmail,
                Subject = $"Известување — Извршно решение во редица И.бр. {request.OrderNumber} — {employee.FullName}",
                Body = BuildEmailBody(
                    $"Лицето <strong>{employee.FullName}</strong> со ЕМБГ <strong>{employee.EMBG}</strong> " +
                    $"вработено во <strong>{companyName}</strong> за кое имате извршно решение " +
                    $"<strong>И.бр. {request.OrderNumber}</strong> има месечни примања во износ од " +
                    $"<strong>{salary}</strong> и веќе има извршно решение од извршител " +
                    $"<strong>{activeOrder.ExecutorName}</strong> " +
                    $"(<strong>И.бр. {activeOrder.OrderNumber}</strong>) по кое се постапува. " +
                    $"Вашето решение е ставено во редица и ќе биде активирано по целосна исплата на претходното.",
                    senderName),
                NotificationType = EmailNotificationType.NewOrderQueued,
                RelatedEntityType = "EnforcementOrder",
                RelatedEntityId = order.Id
            };
        }

        await _uow.EmailLogs.AddAsync(emailLog, ct);
        await _uow.SaveChangesAsync(ct);
        return Result<int>.Success(order.Id);
    }

    private static string BuildEmailBody(string content, string senderName) =>
        $"""
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.6;max-width:600px">
          <p>Почитувани,</p>
          <p>{content}</p>
          <br/>
          <p>Со почит,<br/><strong>{senderName}</strong></p>
        </div>
        """;
}
