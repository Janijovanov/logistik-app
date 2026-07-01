using ExcelDataReader;
using Logistik.API.Filters;
using Logistik.Application.Common.Interfaces;
using Logistik.Application.Common.Models;
using Logistik.Application.Features.Employees.Commands;
using Logistik.Application.Features.Employees.DTOs;
using Logistik.Application.Features.Employees.Queries;
using Logistik.Application.Features.Salaries.Commands;
using Logistik.Application.Features.Salaries.DTOs;
using Logistik.Application.Features.Salaries.Queries;
using Logistik.Domain.Entities;
using Logistik.Domain.Enums;
using Logistik.Domain.Interfaces;
using Logistik.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Logistik.API.Controllers;

[ApiController]
[Route("api/companies/{companyId:int}/employees")]
[Authorize]
[RequiresCompanyAccess]
public class EmployeesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUnitOfWork _uow;
    private readonly IEmailService _email;
    private readonly ICurrentUserService _currentUser;
    private readonly AppDbContext _db;

    public EmployeesController(IMediator mediator, IUnitOfWork uow, IEmailService email, ICurrentUserService currentUser, AppDbContext db)
    {
        _mediator = mediator;
        _uow = uow;
        _email = email;
        _currentUser = currentUser;
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<EmployeeDto>>> GetAll(int companyId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, CancellationToken ct = default)
        => Ok(await _mediator.Send(new GetEmployeesQuery(companyId, page, pageSize, search), ct));

    [HttpGet("monthly")]
    public async Task<ActionResult<IReadOnlyList<EmployeeMonthlySalaryDto>>> GetMonthly(int companyId, [FromQuery] int year, [FromQuery] int month, CancellationToken ct)
        => Ok(await _mediator.Send(new GetEmployeesMonthlySalaryQuery(companyId, year, month), ct));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<EmployeeDto>> GetById(int companyId, int id, CancellationToken ct)
        => Ok(await _mediator.Send(new GetEmployeeByIdQuery(companyId, id), ct));

    [HttpPost]
    public async Task<ActionResult> Create(int companyId, [FromBody] CreateEmployeeRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new CreateEmployeeCommand(companyId, request.FullName, request.EMBG, request.EmploymentStartDate, request.EmploymentEndDate, request.BankAccount, request.NetSalary, request.TransferFromEmployeeId), ct);
        if (!result.Succeeded) return BadRequest(new { message = result.Errors.FirstOrDefault() });
        return StatusCode(201, new { id = result.Value });
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int companyId, int id, [FromBody] UpdateEmployeeRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateEmployeeCommand(id, companyId, request.FullName, request.EMBG, request.EmploymentStartDate, request.EmploymentEndDate, request.BankAccount, request.NetSalary), ct);
        if (!result.Succeeded) return BadRequest(new { message = result.Errors.FirstOrDefault() });
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int companyId, int id, CancellationToken ct)
    {
        var result = await _mediator.Send(new SoftDeleteEmployeeCommand(id, companyId), ct);
        if (!result.Succeeded) return BadRequest(new { message = result.Errors.FirstOrDefault() });
        return NoContent();
    }

    [HttpGet("{id:int}/salary-history")]
    public async Task<ActionResult<PaginatedResult<SalaryHistoryDto>>> GetSalaryHistory(int companyId, int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 24, CancellationToken ct = default)
        => Ok(await _mediator.Send(new GetSalaryHistoryQuery(id, companyId, page, pageSize), ct));

    [HttpPost("{id:int}/salary-history")]
    public async Task<ActionResult> RecordSalary(int companyId, int id, [FromBody] RecordSalaryRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new RecordSalaryCommand(id, companyId, request.SalaryMonth, request.NetSalary, request.Notes), ct);
        if (!result.Succeeded) return BadRequest(new { message = result.Errors.FirstOrDefault() });
        return StatusCode(201, new { id = result.Value });
    }

    [HttpPut("{id:int}/salary-history/{recordId:int}")]
    public async Task<ActionResult> UpdateSalary(int companyId, int id, int recordId, [FromBody] UpdateSalaryRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateSalaryCommand(recordId, id, companyId, request.NetSalary, request.Notes), ct);
        if (!result.Succeeded) return BadRequest(new { message = result.Errors.FirstOrDefault() });
        return NoContent();
    }

    [HttpPost("salary-import")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult> ImportSalaries(int companyId, [FromQuery] int year, [FromQuery] int month, CancellationToken ct)
    {
        var file = Request.Form.Files.GetFile("file");
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "Фајлот е празен или не е прикачен." });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext is not ".xls" and not ".xlsx")
            return BadRequest(new { message = "Дозволени се само .xls и .xlsx фајлови." });

        if (year < 2000 || year > 2100 || month < 1 || month > 12)
            return BadRequest(new { message = "Невалиден месец или година." });

        List<ExcelSalaryRow> rows;
        try { rows = ParseExcelFile(file, ext); }
        catch (Exception ex) { return BadRequest(new { message = $"Грешка при читање на фајлот: {ex.Message}" }); }

        if (rows.Count == 0)
            return BadRequest(new { message = "Не се пронајдени записи во листот 'listaca' или нема валидни редови." });

        var salaryMonth = new DateOnly(year, month, 1);
        var result = await _mediator.Send(new ImportSalariesCommand(companyId, salaryMonth, rows), ct);
        if (!result.Succeeded) return BadRequest(new { message = result.Errors.FirstOrDefault() });

        return Ok(result.Value);
    }

    private static List<ExcelSalaryRow> ParseExcelFile(IFormFile file, string ext)
    {
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

        using var stream = file.OpenReadStream();
        using var reader = ext == ".xls"
            ? ExcelReaderFactory.CreateBinaryReader(stream)
            : ExcelReaderFactory.CreateOpenXmlReader(stream);

        var dataSet = reader.AsDataSet(new ExcelDataSetConfiguration
        {
            ConfigureDataTable = _ => new ExcelDataTableConfiguration { UseHeaderRow = false }
        });

        // Find "listaca" sheet (case-insensitive, also accept partial match)
        DataTable? sheet = null;
        foreach (DataTable t in dataSet.Tables)
        {
            var name = t.TableName.Trim().ToLowerInvariant();
            if (name.Contains("listac") || name.Contains("листац") || name.Contains("listici") || name.Contains("листич"))
            { sheet = t; break; }
        }
        // fallback: use first sheet if still not found
        sheet ??= dataSet.Tables.Count > 0 ? dataSet.Tables[0] : null;
        if (sheet is null) throw new Exception("Фајлот не содржи листови.");

        // Find header row — first row where we can locate required columns
        int headerRow = -1;
        int colIme = -1, colPrezime = -1, colMatBr = -1, colNetoEfek = -1;

        for (int r = 0; r < Math.Min(sheet.Rows.Count, 30); r++)
        {
            var cells = sheet.Rows[r].ItemArray.Select(c => c?.ToString()?.Trim().ToLowerInvariant() ?? "").ToArray();
            int ime = FindCol(cells, "ime");
            int prez = FindCol(cells, "prezime");
            int mat = FindCol(cells, "mat_br", "matbr", "embg", "mat br");
            int neto = FindCol(cells, "neto_efek", "netoefek", "neto efek", "neto");
            if (ime >= 0 && prez >= 0 && mat >= 0 && neto >= 0)
            {
                headerRow = r; colIme = ime; colPrezime = prez; colMatBr = mat; colNetoEfek = neto;
                break;
            }
        }

        var sheetNames = string.Join(", ", dataSet.Tables.Cast<DataTable>().Select(t => t.TableName));
        if (headerRow < 0) throw new Exception($"Не се пронајдени колоните: ime, prezime, mat_br, neto_efek. Листови во фајлот: {sheetNames}. Проверете ги имињата на колоните.");

        var rows = new List<ExcelSalaryRow>();
        for (int r = headerRow + 1; r < sheet.Rows.Count; r++)
        {
            var row = sheet.Rows[r];
            var embg = row[colMatBr]?.ToString()?.Trim() ?? "";
            var ime = row[colIme]?.ToString()?.Trim() ?? "";
            var prez = row[colPrezime]?.ToString()?.Trim() ?? "";
            var netoStr = row[colNetoEfek]?.ToString()?.Trim() ?? "";

            if (string.IsNullOrWhiteSpace(embg)) continue;
            if (!decimal.TryParse(netoStr, System.Globalization.NumberStyles.Any,
                System.Globalization.CultureInfo.InvariantCulture, out var neto) || neto <= 0) continue;

            rows.Add(new ExcelSalaryRow(embg, $"{prez} {ime}".Trim(), neto));
        }
        return rows;
    }

    // ── Termination email notifications ──────────────────────────────────

    [HttpGet("{id:int}/termination-emails")]
    public async Task<ActionResult> GetTerminationEmails(int companyId, int id, CancellationToken ct)
    {
        var employee = await _db.Employees.IgnoreQueryFilters()
            .FirstOrDefaultAsync(e => e.Id == id && e.CompanyId == companyId, ct);
        if (employee is null) return NotFound();

        var company = await _db.Companies.FirstOrDefaultAsync(c => c.Id == employee.CompanyId, ct);
        var companyName = company?.Name ?? string.Empty;

        var orders = await _db.EnforcementOrders
            .Where(o => o.EmployeeId == id &&
                        o.Status != OrderStatus.Completed &&
                        o.Status != OrderStatus.Archived &&
                        !o.IsArchived)
            .OrderBy(o => o.QueuePosition)
            .ToListAsync(ct);

        var orderIds = orders.Select(o => o.Id).ToList();

        var emailLogs = await _db.EmailLogs
            .Where(e => e.NotificationType == EmailNotificationType.EmploymentEnding &&
                        e.RelatedEntityType == "EnforcementOrder" &&
                        orderIds.Contains(e.RelatedEntityId!.Value))
            .ToListAsync(ct);

        var currentUser = await _uow.Users.GetByIdAsync(_currentUser.UserId, ct);
        var senderName = currentUser is not null
            ? $"{currentUser.FirstName} {currentUser.LastName}".Trim()
            : _currentUser.Username;

        // Auto-create email logs for orders that don't have one yet
        var endDateForLog = employee.EmploymentEndDate.HasValue
            ? employee.EmploymentEndDate.Value.ToString("dd.MM.yyyy") : "—";
        bool anyCreated = false;
        foreach (var order in orders)
        {
            if (!emailLogs.Any(e => e.RelatedEntityId == order.Id))
            {
                var ct2 = employee.EmploymentEndDate.HasValue
                    ? employee.EmploymentEndDate.Value.ToString("dd.MM.yyyy") : "—";
                var body =
                    $"Лицето \"{employee.FullName}\" со ЕМБГ \"{employee.EMBG}\" вработено во \"{companyName}\" " +
                    $"кое е во процес на извршување по извршно решение \"И.бр. {order.OrderNumber}\" " +
                    $"го прекинало работниот однос на ден {ct2}. " +
                    $"Вкупна сума: {order.TotalAmount:N2} ден. | " +
                    $"Вкупно платено: {order.TotalPaid:N2} ден. | " +
                    $"Преостанат износ: {order.RemainingAmount:N2} ден.";
                var newLog = new EmailLog
                {
                    RecipientEmail = order.ExecutorEmail,
                    Subject = $"Известување за прекин на работен однос — {employee.FullName} — И.бр. {order.OrderNumber}",
                    Body = BuildTerminationHtmlBody(body, senderName),
                    NotificationType = EmailNotificationType.EmploymentEnding,
                    RelatedEntityType = "EnforcementOrder",
                    RelatedEntityId = order.Id
                };
                _db.EmailLogs.Add(newLog);
                emailLogs.Add(newLog);
                anyCreated = true;
            }
        }
        if (anyCreated)
            await _db.SaveChangesAsync(ct);

        var result = orders.Select(order =>
        {
            var log = emailLogs.FirstOrDefault(e => e.RelatedEntityId == order.Id);
            var endDateStr = employee.EmploymentEndDate.HasValue
                ? employee.EmploymentEndDate.Value.ToString("dd.MM.yyyy") : "—";

            var contentText =
                $"Лицето \"{employee.FullName}\" со ЕМБГ \"{employee.EMBG}\" вработено во \"{companyName}\" " +
                $"кое е во процес на извршување по извршно решение \"И.бр. {order.OrderNumber}\" " +
                $"го прекинало работниот однос на ден {endDateStr}. " +
                $"Вкупна сума: {order.TotalAmount:N2} ден. | " +
                $"Вкупно платено: {order.TotalPaid:N2} ден. | " +
                $"Преостанат износ: {order.RemainingAmount:N2} ден.";

            return new
            {
                emailLogId = log!.Id,   // always set — auto-created above if missing
                orderId = order.Id,
                executorName = order.ExecutorName,
                executorEmail = order.ExecutorEmail,
                orderNumber = order.OrderNumber,
                subject = log.Subject,
                contentText,
                senderName,
                isSent = log.IsSent,
                sentAt = log.SentAt,
                errorMessage = log.ErrorMessage
            };
        }).ToList();

        return Ok(result);
    }

    [HttpPost("{id:int}/termination-emails/{emailLogId:int}/send")]
    public async Task<ActionResult> SendTerminationEmail(int companyId, int id, int emailLogId,
        [FromBody] SendTerminationEmailRequest request, CancellationToken ct)
    {
        var log = await _db.EmailLogs.FindAsync([emailLogId], ct);
        if (log is null) return NotFound();

        var currentUser = await _uow.Users.GetByIdAsync(_currentUser.UserId, ct);
        var senderName = currentUser is not null
            ? $"{currentUser.FirstName} {currentUser.LastName}".Trim()
            : _currentUser.Username;

        if (request.Subject is not null) log.Subject = request.Subject;
        if (request.BodyText is not null)
            log.Body = BuildTerminationHtmlBody(request.BodyText, senderName);

        log.IsSent = false;
        _db.EmailLogs.Update(log);
        await _db.SaveChangesAsync(ct);

        var success = await _email.SendSavedAsync(log, ct);
        return Ok(new { success, error = success ? null : log.ErrorMessage });
    }

    [HttpPost("{id:int}/termination-emails/{emailLogId:int}/reset")]
    public async Task<ActionResult> ResetTerminationEmail(int companyId, int id, int emailLogId, CancellationToken ct)
    {
        var log = await _db.EmailLogs.FindAsync([emailLogId], ct);
        if (log is null) return NoContent();
        log.IsSent = false;
        log.SentAt = null;
        log.ErrorMessage = null;
        log.RetryCount = 0;
        _db.EmailLogs.Update(log);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    private static int FindCol(string[] cells, params string[] names)
    {
        foreach (var name in names)
        {
            var idx = Array.FindIndex(cells, c => c == name || c.Replace(" ", "_") == name || c.Replace("_", " ") == name);
            if (idx >= 0) return idx;
        }
        return -1;
    }

    private static string BuildTerminationHtmlBody(string contentText, string senderName) =>
        $"""
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.6;max-width:600px">
          <p>Почитувани,</p>
          <p>{System.Net.WebUtility.HtmlEncode(contentText).Replace("&#xA;", "<br/>")}</p>
          <br/>
          <p>Со почит,<br/><strong>{senderName}</strong></p>
        </div>
        """;
}

public record SendTerminationEmailRequest(string? Subject, string? BodyText);
