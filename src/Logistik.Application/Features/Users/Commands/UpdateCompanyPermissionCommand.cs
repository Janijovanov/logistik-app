using Logistik.Application.Common.Models;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Users.Commands;

public record UpdateCompanyPermissionCommand(int UserId, int CompanyId, bool CanView, bool CanEdit, bool CanExport) : IRequest<Result>;

public class UpdateCompanyPermissionCommandHandler : IRequestHandler<UpdateCompanyPermissionCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public UpdateCompanyPermissionCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(UpdateCompanyPermissionCommand request, CancellationToken ct)
    {
        var user = await _uow.Users.GetWithPermissionsAsync(request.UserId, ct)
            ?? throw new NotFoundException("User", request.UserId);

        var permission = user.CompanyPermissions.FirstOrDefault(p => p.CompanyId == request.CompanyId);
        if (permission is null)
            return Result.Failure($"User does not have permission for company {request.CompanyId}.");

        permission.CanView = request.CanView;
        permission.CanEdit = request.CanEdit;
        permission.CanExport = request.CanExport;
        permission.UpdatedAt = DateTime.UtcNow;

        _uow.Users.Update(user);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
