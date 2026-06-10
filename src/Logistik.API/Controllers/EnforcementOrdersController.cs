using Logistik.API.Filters;
using Logistik.Application.Common.Interfaces;
using Logistik.Application.Features.EnforcementOrders.Commands;
using Logistik.Application.Features.EnforcementOrders.DTOs;
using Logistik.Application.Features.EnforcementOrders.Queries;
using Logistik.Domain.Entities;
using Logistik.Domain.Enums;
using Logistik.Domain.Interfaces;
using Logistik.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Logistik.API.Controllers;

[ApiController]
[Route("api/companies/{companyId:int}/employees/{employeeId:int}/enforcement-orders")]
[Authorize]
[RequiresCompanyAccess]
public class EnforcementOrdersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUnitOfWork _uow;
    private readonly IEmailService _email;
    private readonly ICurrentUserService _currentUser;
    private readonly AppDbContext _db;

    public EnforcementOrdersController(IMediator mediator, IUnitOfWork uow, IEmailService email, ICurrentUserService currentUser, AppDbContext db)
    {
        _mediator = mediator;
        _uow = uow;
        _email = email;
        _currentUser = currentUser;
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<EnforcementOrderDto>>> GetAll(int companyId, int employeeId, [FromQuery] bool includeArchived = false, CancellationToken ct = default)
        => Ok(await _mediator.Send(new GetEnforcementOrdersQuery(employeeId, companyId, includeArchived), ct));

    [HttpPost]
    public async Task<ActionResult> Create(int companyId, int employeeId, [FromBody] CreateEnforcementOrderRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new CreateEnforcementOrderCommand(
            employeeId, companyId,
            request.OrderNumber, request.ExecutorName, request.ExecutorEmail, request.ExecutorBankAccount,
            request.TotalAmount, request.MonthlyDeduction, request.ReceivedDate), ct);
        if (!result.Succeeded) return BadRequest(new { message = result.Errors.FirstOrDefault() });
        return StatusCode(201, new { id = result.Value });
    }

    [HttpPost("{id:int}/mark-paid")]
    public async Task<ActionResult> MarkPaid(int companyId, int employeeId, int id, CancellationToken ct)
    {
        var result = await _mediator.Send(new MarkOrderPaidCommand(id, employeeId, companyId), ct);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return NoContent();
    }

    [HttpGet("{id:int}/email-preview")]
    public async Task<ActionResult> EmailPreview(int companyId, int employeeId, int id, CancellationToken ct)
    {
        var data = await BuildEmailDataAsync(id, ct);
        if (data is null) return NotFound();

        var log = await _uow.EmailLogs.GetByEnforcementOrderIdAsync(id, ct);

        return Ok(new
        {
            recipientEmail = data.RecipientEmail,
            subject = data.Subject,
            contentText = data.ContentText,
            senderName = data.SenderName,
            isSent = log?.IsSent ?? false,
            sentAt = log?.SentAt,
            errorMessage = log?.ErrorMessage
        });
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteOrder(int companyId, int employeeId, int id, CancellationToken ct)
    {
        var order = await _db.EnforcementOrders
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(o => o.Id == id, ct);
        if (order is null) return NotFound();

        var wasActive = order.Status == OrderStatus.Active ||
                        order.Status == OrderStatus.LastInstallment ||
                        order.Status == OrderStatus.Final;

        // Nullify salary history references to this order
        var salaryRefs = await _db.EmployeeSalaryHistories
            .Where(s => s.EnforcementOrderId == id)
            .ToListAsync(ct);
        foreach (var s in salaryRefs) s.EnforcementOrderId = null;

        // Remove payments linked to this order
        var payments = await _db.EnforcementPayments
            .Where(p => p.EnforcementOrderId == id)
            .ToListAsync(ct);
        _db.EnforcementPayments.RemoveRange(payments);

        // Remove email logs for this order
        var emailLogs = await _db.EmailLogs
            .Where(e => e.RelatedEntityType == "EnforcementOrder" && e.RelatedEntityId == id)
            .ToListAsync(ct);
        _db.EmailLogs.RemoveRange(emailLogs);

        _db.EnforcementOrders.Remove(order);
        await _db.SaveChangesAsync(ct);

        // If deleted order was active, promote next queued one
        if (wasActive)
        {
            var next = await _db.EnforcementOrders
                .Where(o => o.EmployeeId == order.EmployeeId && o.Status == OrderStatus.Queued && !o.IsArchived)
                .OrderBy(o => o.QueuePosition)
                .FirstOrDefaultAsync(ct);
            if (next is not null)
            {
                next.Status = OrderStatus.Active;
                next.QueuePosition = 0;
                await _db.SaveChangesAsync(ct);

                var remaining = await _db.EnforcementOrders
                    .Where(o => o.EmployeeId == order.EmployeeId && o.Status == OrderStatus.Queued && !o.IsArchived)
                    .OrderBy(o => o.QueuePosition)
                    .ToListAsync(ct);
                for (int i = 0; i < remaining.Count; i++) remaining[i].QueuePosition = i + 1;
                await _db.SaveChangesAsync(ct);
            }
        }

        return NoContent();
    }

    [HttpPost("{id:int}/reset-notification")]
    public async Task<ActionResult> ResetNotification(int companyId, int employeeId, int id, CancellationToken ct)
    {
        var log = await _uow.EmailLogs.GetByEnforcementOrderIdAsync(id, ct);
        if (log is null) return NoContent();
        log.IsSent = false;
        log.SentAt = null;
        log.ErrorMessage = null;
        log.RetryCount = 0;
        _uow.EmailLogs.Update(log);
        await _uow.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPost("{id:int}/send-notification")]
    public async Task<ActionResult> SendNotification(int companyId, int employeeId, int id,
        [FromBody] SendNotificationRequest request, CancellationToken ct)
    {
        var data = await BuildEmailDataAsync(id, ct);
        if (data is null) return NotFound();

        var subject = request.Subject ?? data.Subject;
        var bodyText = request.BodyText ?? data.ContentText;
        var bodyHtml = BuildBody(bodyText, data.SenderName);

        var log = await _uow.EmailLogs.GetByEnforcementOrderIdAsync(id, ct);
        if (log is null || log.RelatedEntityId == 0)
        {
            log = new EmailLog
            {
                RecipientEmail = data.RecipientEmail,
                Subject = subject,
                Body = bodyHtml,
                NotificationType = EmailNotificationType.NewOrderQueued,
                RelatedEntityType = "EnforcementOrder",
                RelatedEntityId = id
            };
            await _uow.EmailLogs.AddAsync(log, ct);
            await _uow.SaveChangesAsync(ct);
        }
        else
        {
            log.Subject = subject;
            log.Body = bodyHtml;
            log.IsSent = false;
            _uow.EmailLogs.Update(log);
            await _uow.SaveChangesAsync(ct);
        }

        var success = await _email.SendSavedAsync(log, ct);
        return Ok(new { success, error = success ? null : log.ErrorMessage });
    }

    private sealed record EmailData(
        string RecipientEmail, string Subject, string ContentText, string SenderName);

    private async Task<EmailData?> BuildEmailDataAsync(int orderId, CancellationToken ct)
    {
        // Load each entity independently with IgnoreQueryFilters to bypass
        // the Employee.IsDeleted filter that breaks Include-based loading
        var order = await _db.EnforcementOrders
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(o => o.Id == orderId, ct);
        if (order is null) return null;

        var employee = await _db.Employees
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(e => e.Id == order.EmployeeId, ct);
        if (employee is null) return null;

        var company = await _db.Companies
            .FirstOrDefaultAsync(c => c.Id == employee.CompanyId, ct);
        var companyName = company?.Name ?? "Логистик";
        var salary = employee.NetSalary.ToString("N2") + " ден.";

        var currentUser = await _uow.Users.GetByIdAsync(_currentUser.UserId, ct);
        var senderName = currentUser is not null
            ? $"{currentUser.FirstName} {currentUser.LastName}".Trim()
            : _currentUser.Username;

        string subject, contentText;

        if (order.Status == OrderStatus.Queued)
        {
            var activeOrder = await _db.EnforcementOrders
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(o => o.EmployeeId == employee.Id && !o.IsArchived &&
                    (o.Status == OrderStatus.Active || o.Status == OrderStatus.LastInstallment || o.Status == OrderStatus.Final), ct);
            var activeExecutor = activeOrder?.ExecutorName ?? "друг извршител";
            subject = $"Известување — И.бр. {order.OrderNumber} — {employee.FullName}";
            contentText =
                $"Лицето \"{employee.FullName}\" со ЕМБГ \"{employee.EMBG}\" вработено во \"{companyName}\" " +
                $"за кое имате извршно решение \"И.бр. {order.OrderNumber}\" има месечни примања во износ од " +
                $"\"{salary}\" и веќе има извршно решение од извршител \"{activeExecutor}\" по кое се постапува.";
        }
        else
        {
            subject = $"Известување — И.бр. {order.OrderNumber} — {employee.FullName}";
            contentText =
                $"Лицето \"{employee.FullName}\" со ЕМБГ \"{employee.EMBG}\" вработено во \"{companyName}\" " +
                $"за кое имате извршно решение \"И.бр. {order.OrderNumber}\" има месечни примања во износ од " +
                $"\"{salary}\" и нема други задршки од извршители.";
        }

        return new EmailData(order.ExecutorEmail, subject, contentText, senderName);
    }

    private static string BuildBody(string contentText, string senderName) =>
        $"""
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.6;max-width:600px">
          <p>Почитувани,</p>
          <p>{System.Net.WebUtility.HtmlEncode(contentText).Replace("&#xA;", "<br/>")}</p>
          <br/>
          <p>Со почит,<br/><strong>{senderName}</strong></p>
        </div>
        """;
}

public record SendNotificationRequest(string? Subject, string? BodyText);
