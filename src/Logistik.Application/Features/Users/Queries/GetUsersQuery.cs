using Logistik.Application.Common.Models;
using Logistik.Application.Features.Users.DTOs;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Users.Queries;

public record GetUsersQuery(int Page = 1, int PageSize = 20, string? Search = null, bool? IsActive = null) : IRequest<PaginatedResult<UserDto>>;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PaginatedResult<UserDto>>
{
    private readonly IUnitOfWork _uow;

    public GetUsersQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<PaginatedResult<UserDto>> Handle(GetUsersQuery request, CancellationToken ct)
    {
        var (items, total) = await _uow.Users.GetPagedAsync(request.Page, request.PageSize, request.Search, request.IsActive, ct);
        return new PaginatedResult<UserDto>
        {
            Items = items.Select(u => new UserDto(u.Id, u.Username, u.Email, u.FirstName, u.LastName, u.Role.Name, u.IsActive, u.CreatedAt)).ToList(),
            TotalCount = total,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
