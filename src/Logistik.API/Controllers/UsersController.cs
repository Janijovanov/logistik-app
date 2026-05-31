using Logistik.Application.Common.Models;
using Logistik.Application.Features.Users.Commands;
using Logistik.Application.Features.Users.DTOs;
using Logistik.Application.Features.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Logistik.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<UserDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, CancellationToken ct = default)
        => Ok(await _mediator.Send(new GetUsersQuery(page, pageSize, search), ct));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDetailDto>> GetById(int id, CancellationToken ct)
        => Ok(await _mediator.Send(new GetUserByIdQuery(id), ct));

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateUserRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new CreateUserCommand(request.Username, request.Email, request.Password, request.FirstName, request.LastName, request.RoleId), ct);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return CreatedAtAction(nameof(GetAll), new { id = result.Value });
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateUserRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateUserCommand(id, request.Email, request.FirstName, request.LastName, request.RoleId, request.IsActive), ct);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        var result = await _mediator.Send(new DeleteUserCommand(id), ct);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return NoContent();
    }

    [HttpPost("{id:int}/permissions")]
    public async Task<ActionResult> AssignPermission(int id, [FromBody] AssignCompanyPermissionRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new AssignCompanyPermissionCommand(id, request.CompanyId, request.CanView, request.CanEdit, request.CanExport), ct);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return NoContent();
    }

    [HttpPut("{id:int}/permissions/{companyId:int}")]
    public async Task<ActionResult> UpdatePermission(int id, int companyId, [FromBody] UpdateCompanyPermissionRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateCompanyPermissionCommand(id, companyId, request.CanView, request.CanEdit, request.CanExport), ct);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return NoContent();
    }

    [HttpDelete("{id:int}/permissions/{companyId:int}")]
    public async Task<ActionResult> RevokePermission(int id, int companyId, CancellationToken ct)
    {
        var result = await _mediator.Send(new RevokeCompanyPermissionCommand(id, companyId), ct);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return NoContent();
    }
}
