using Logistik.Application.Common.Interfaces;
using Logistik.Application.Features.Auth.DTOs;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Auth.Queries;

public record GetCurrentUserQuery : IRequest<CurrentUserDto>;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, CurrentUserDto>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public GetCurrentUserQueryHandler(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    public async Task<CurrentUserDto> Handle(GetCurrentUserQuery request, CancellationToken ct)
    {
        var user = await _uow.Users.GetWithPermissionsAsync(_currentUser.UserId, ct)
            ?? throw new NotFoundException("User", _currentUser.UserId);

        var permissions = user.CompanyPermissions.Select(p => new CompanyPermissionDto(
            p.CompanyId,
            p.Company.Name,
            p.CanView,
            p.CanEdit,
            p.CanExport)).ToList();

        var companyIds = user.CompanyPermissions.Select(p => p.CompanyId).ToList();

        return new CurrentUserDto(
            user.Id,
            user.Username,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Role.Name,
            companyIds,
            permissions);
    }
}
