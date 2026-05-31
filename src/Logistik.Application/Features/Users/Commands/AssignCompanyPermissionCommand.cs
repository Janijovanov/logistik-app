using Logistik.Application.Common.Interfaces;
using Logistik.Application.Common.Models;
using Logistik.Domain.Entities;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Users.Commands;

public record AssignCompanyPermissionCommand(int UserId, int CompanyId, bool CanView, bool CanEdit, bool CanExport) : IRequest<Result>;

public class AssignCompanyPermissionCommandHandler : IRequestHandler<AssignCompanyPermissionCommand, Result>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public AssignCompanyPermissionCommandHandler(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    public async Task<Result> Handle(AssignCompanyPermissionCommand request, CancellationToken ct)
    {
        var user = await _uow.Users.GetWithPermissionsAsync(request.UserId, ct)
            ?? throw new NotFoundException("User", request.UserId);

        var company = await _uow.Companies.GetByIdAsync(request.CompanyId, ct)
            ?? throw new NotFoundException("Company", request.CompanyId);

        var existing = user.CompanyPermissions.FirstOrDefault(p => p.CompanyId == request.CompanyId);
        if (existing is not null)
        {
            existing.CanView = request.CanView;
            existing.CanEdit = request.CanEdit;
            existing.CanExport = request.CanExport;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var permission = new UserCompanyPermission
            {
                UserId = request.UserId,
                CompanyId = request.CompanyId,
                CanView = request.CanView,
                CanEdit = request.CanEdit,
                CanExport = request.CanExport,
                AssignedByUserId = _currentUser.UserId
            };
            await _uow.Companies.GetByIdAsync(request.CompanyId, ct);
            user.CompanyPermissions.Add(permission);
        }

        _uow.Users.Update(user);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
