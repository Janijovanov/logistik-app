using Logistik.Application.Common.Interfaces;
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
    private readonly IEmailService _email;

    public UpdateEmployeeCommandHandler(IUnitOfWork uow, IEmailService email)
    {
        _uow = uow;
        _email = email;
    }

    public async Task<Result> Handle(UpdateEmployeeCommand request, CancellationToken ct)
    {
        var employee = await _uow.Employees.GetWithOrdersAsync(request.Id, ct)
            ?? throw new NotFoundException("Employee", request.Id);

        if (employee.CompanyId != request.CompanyId)
            return Result.Failure("Employee does not belong to this company.");

        if (await _uow.Employees.EmbgExistsAsync(request.EMBG, request.Id, ct))
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
            var activeOrders = employee.EnforcementOrders
                .Where(o => o.Status != Logistik.Domain.Enums.OrderStatus.Completed && o.Status != Logistik.Domain.Enums.OrderStatus.Archived)
                .ToList();

            foreach (var order in activeOrders)
            {
                var log = new EmailLog
                {
                    RecipientEmail = order.ExecutorEmail,
                    Subject = $"Obvestilo o prenehanju zaposlitve — {employee.FullName}",
                    Body = $"Zaposleni {employee.FullName} (EMBG: {employee.EMBG}) ima datum prenehanja delovnega razmerja: {request.EmploymentEndDate}. " +
                           $"Izvrsno resenje {order.OrderNumber} bo morda prizadeto.",
                    NotificationType = EmailNotificationType.EmploymentEnding,
                    RelatedEntityType = "Employee",
                    RelatedEntityId = employee.Id
                };
                await _email.QueueAsync(log, ct);
            }
        }

        return Result.Success();
    }
}
