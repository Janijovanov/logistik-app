using Logistik.Application.Features.Executors.Commands;
using Logistik.Application.Features.Executors.DTOs;
using Logistik.Application.Features.Executors.Queries;
using Logistik.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Logistik.API.Controllers;

[ApiController]
[Route("api/executors")]
[Authorize]
public class ExecutorsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ExecutorsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ExecutorDto>>> GetAll(CancellationToken ct)
        => Ok(await _mediator.Send(new GetAllExecutorsQuery(), ct));

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateExecutorRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new CreateExecutorCommand(request.Name, request.Email, request.BankAccount), ct);
        if (!result.Succeeded) return BadRequest(new { message = result.Errors.FirstOrDefault() });
        return StatusCode(201, new { id = result.Value });
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        var result = await _mediator.Send(new DeleteExecutorCommand(id), ct);
        if (!result.Succeeded) return BadRequest(new { message = result.Errors.FirstOrDefault() });
        return NoContent();
    }
}
