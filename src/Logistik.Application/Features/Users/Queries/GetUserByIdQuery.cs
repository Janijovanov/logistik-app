using Logistik.Application.Features.Users.DTOs;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Users.Queries;

public record GetUserByIdQuery(int UserId) : IRequest<UserDetailDto>;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDetailDto>
{
    private readonly IUnitOfWork _uow;

    public GetUserByIdQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<UserDetailDto> Handle(GetUserByIdQuery request, CancellationToken ct)
    {
        var user = await _uow.Users.GetWithPermissionsAsync(request.UserId, ct)
            ?? throw new NotFoundException("User", request.UserId);

        return new UserDetailDto(
            user.Id,
            user.Username,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Role.Name,
            user.IsActive,
            user.CreatedAt,
            user.CompanyPermissions.Select(p => new UserPermissionDto(
                p.CompanyId,
                p.Company.Name,
                p.CanView,
                p.CanEdit,
                p.CanExport
            )).ToList()
        );
    }
}
