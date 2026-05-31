using Logistik.Application.Common.Models;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Users.Commands;

public record RevokeCompanyPermissionCommand(int UserId, int CompanyId) : IRequest<Result>;

public class RevokeCompanyPermissionCommandHandler : IRequestHandler<RevokeCompanyPermissionCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public RevokeCompanyPermissionCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(RevokeCompanyPermissionCommand request, CancellationToken ct)
    {
        var user = await _uow.Users.GetWithPermissionsAsync(request.UserId, ct)
            ?? throw new NotFoundException("User", request.UserId);

        var permission = user.CompanyPermissions.FirstOrDefault(p => p.CompanyId == request.CompanyId);
        if (permission is null)
            return Result.Failure($"User does not have permission for company {request.CompanyId}.");

        user.CompanyPermissions.Remove(permission);
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
