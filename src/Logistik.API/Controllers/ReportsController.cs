using Logistik.Application.Common.Interfaces;
using Logistik.Application.Features.Reports.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Logistik.API.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IExportService _export;
    private readonly IMediator _mediator;

    public ReportsController(IExportService export, IMediator mediator)
    {
        _export = export;
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetDashboardStatsQuery(), ct);
        return Ok(result);
    }

    [HttpGet("employees/{id:int}/export/pdf")]
    public async Task<IActionResult> EmployeePdf(int id, [FromQuery] string lang = "mk", CancellationToken ct = default)
    {
        var bytes = await _export.ExportEmployeeToPdfAsync(id, lang, ct);
        return File(bytes, "application/pdf", $"employee_{id}.pdf");
    }

    [HttpGet("employees/{id:int}/export/excel")]
    public async Task<IActionResult> EmployeeExcel(int id, [FromQuery] string lang = "mk", CancellationToken ct = default)
    {
        var bytes = await _export.ExportEmployeeToExcelAsync(id, lang, ct);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"employee_{id}.xlsx");
    }

    [HttpGet("enforcement-orders/{id:int}/export/pdf")]
    public async Task<IActionResult> OrderPdf(int id, CancellationToken ct)
    {
        var bytes = await _export.ExportEnforcementOrderToPdfAsync(id, ct);
        return File(bytes, "application/pdf", $"order_{id}.pdf");
    }

    [HttpGet("enforcement-orders/{id:int}/export/excel")]
    public async Task<IActionResult> OrderExcel(int id, CancellationToken ct)
    {
        var bytes = await _export.ExportEnforcementOrderToExcelAsync(id, ct);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"order_{id}.xlsx");
    }

    [HttpGet("companies/{companyId:int}/employees/export/excel")]
    public async Task<IActionResult> CompanyEmployeesExcel(int companyId, CancellationToken ct)
    {
        var bytes = await _export.ExportCompanyEmployeesToExcelAsync(companyId, ct);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"company_{companyId}_employees.xlsx");
    }

    [HttpGet("companies/{companyId:int}/enforcement-deductions/export/excel")]
    public async Task<IActionResult> EnforcementDeductionsExcel(int companyId, [FromQuery] int year, [FromQuery] int month, CancellationToken ct)
    {
        var bytes = await _export.ExportEnforcementDeductionsToExcelAsync(companyId, year, month, ct);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"izvrsni-{companyId}-{year}-{month:D2}.xlsx");
    }

    [HttpGet("salary-history/{recordId:int}/payment-order")]
    public async Task<IActionResult> PaymentOrderPdf(int recordId, [FromQuery] bool overflow = false, CancellationToken ct = default)
    {
        var bytes = await _export.ExportPaymentOrderPdfAsync(recordId, overflow, ct);
        if (bytes.Length == 0) return NotFound();
        return File(bytes, "application/pdf", $"nalog-{recordId}{(overflow ? "-2" : "")}.pdf");
    }
}
