using Logistik.Application.Common.Models;
using Logistik.Domain.Entities;
using Logistik.Domain.Enums;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Employees.Commands;

public record UpdateEmployeeCommand(int Id, int CompanyId, string FullName, string EMBG, DateOnly EmploymentStartDate, DateOnly? EmploymentEndDate, string BankAccount, decimal NetSalary) : IRequest<Result>;

public class UpdateEmployeeCommandHandler : IRequestHandler<UpdateEmployeeCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public UpdateEmployeeCommandHandler(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<Result> Handle(UpdateEmployeeCommand request, CancellationToken ct)
    {
        var employee = await _uow.Employees.GetWithOrdersAsync(request.Id, ct)
            ?? throw new NotFoundException("Employee", request.Id);

        if (employee.CompanyId != request.CompanyId)
            return Result.Failure("Employee does not belong to this company.");

        if (await _uow.Employees.EmbgExistsAsync(request.EMBG, request.CompanyId, request.Id, ct))
            return Result.Failure("EMBG already registered.");

        bool employmentEndDateAdded = employee.EmploymentEndDate is null && request.EmploymentEndDate.HasValue;

        employee.FullName = request.FullName;
        employee.EMBG = request.EMBG;
        employee.EmploymentStartDate = request.EmploymentStartDate;
        employee.EmploymentEndDate = request.EmploymentEndDate;
        employee.BankAccount = request.BankAccount;
        employee.NetSalary = request.NetSalary;
        employee.UpdatedAt = DateTime.UtcNow;

        _uow.Employees.Update(employee);
        await _uow.SaveChangesAsync(ct);

        if (employmentEndDateAdded)
        {
            var company = await _uow.Companies.GetByIdAsync(employee.CompanyId, ct);
            var companyName = company?.Name ?? string.Empty;
            var endDateStr = request.EmploymentEndDate!.Value.ToString("dd.MM.yyyy");

            var activeOrders = employee.EnforcementOrders
                .Where(o => o.Status != OrderStatus.Completed && o.Status != OrderStatus.Archived)
                .ToList();

            foreach (var order in activeOrders)
            {
                var subject = $"Известување за прекин на работен однос — {employee.FullName} — И.бр. {order.OrderNumber}";
                var contentText =
                    $"Лицето \"{employee.FullName}\" со ЕМБГ \"{employee.EMBG}\" вработено во \"{companyName}\" " +
                    $"кое е во процес на извршување по извршно решение \"И.бр. {order.OrderNumber}\" " +
                    $"го прекинало работниот однос на ден {endDateStr}. " +
                    $"Вкупна сума: {order.TotalAmount:N2} ден. | " +
                    $"Вкупно платено: {order.TotalPaid:N2} ден. | " +
                    $"Преостанат износ: {order.RemainingAmount:N2} ден.";

                var body = BuildHtmlBody(contentText);

                var log = new EmailLog
                {
                    RecipientEmail = order.ExecutorEmail,
                    Subject = subject,
                    Body = body,
                    NotificationType = EmailNotificationType.EmploymentEnding,
                    RelatedEntityType = "EnforcementOrder",
                    RelatedEntityId = order.Id
                };
                await _uow.EmailLogs.AddAsync(log, ct);
            }

            if (activeOrders.Count > 0)
                await _uow.SaveChangesAsync(ct);
        }

        return Result.Success();
    }

    private static string BuildHtmlBody(string contentText) =>
        $"""
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.6;max-width:600px">
          <p>Почитувани,</p>
          <p>{System.Net.WebUtility.HtmlEncode(contentText)}</p>
          <br/>
          <p>Со почит,<br/><strong>Logistik систем</strong></p>
        </div>
        """;
}
