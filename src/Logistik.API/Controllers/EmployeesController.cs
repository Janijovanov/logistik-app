using Logistik.API.Filters;
using Logistik.Application.Common.Models;
using Logistik.Application.Features.Employees.Commands;
using Logistik.Application.Features.Employees.DTOs;
using Logistik.Application.Features.Employees.Queries;
using Logistik.Application.Features.Salaries.Commands;
using Logistik.Application.Features.Salaries.DTOs;
using Logistik.Application.Features.Salaries.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Logistik.API.Controllers;

[ApiController]
[Route("api/companies/{companyId:int}/employees")]
[Authorize]
[RequiresCompanyAccess]
public class EmployeesController : ControllerBase
{
    private readonly IMediator _mediator;

    public EmployeesController(IMediator mediator) => _mediator = mediator;

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
}
