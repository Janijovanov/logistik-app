using Logistik.Application.Common.Models;
using Logistik.Application.Features.Companies.Commands;
using Logistik.Application.Features.Companies.DTOs;
using Logistik.Application.Features.Companies.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Logistik.API.Controllers;

[ApiController]
[Route("api/companies")]
[Authorize]
public class CompaniesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CompaniesController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<CompanyDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, CancellationToken ct = default)
        => Ok(await _mediator.Send(new GetCompaniesQuery(page, pageSize, search), ct));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CompanyDto>> GetById(int id, CancellationToken ct)
        => Ok(await _mediator.Send(new GetCompanyByIdQuery(id), ct));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Create([FromBody] CreateCompanyRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new CreateCompanyCommand(request.Name, request.HeadquartersAddress, request.TaxNumber, request.RegistrationNumber), ct);
        if (!result.Succeeded) return BadRequest(new { message = result.Errors.FirstOrDefault() });
        return StatusCode(201, new { id = result.Value });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateCompanyRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateCompanyCommand(id, request.Name, request.HeadquartersAddress, request.TaxNumber, request.RegistrationNumber, request.IsActive), ct);
        if (!result.Succeeded) return BadRequest(new { message = result.Errors.FirstOrDefault() });
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        var result = await _mediator.Send(new DeleteCompanyCommand(id), ct);
        if (!result.Succeeded) return BadRequest(new { message = result.Errors.FirstOrDefault() });
        return NoContent();
    }
}
