using Logistik.Application.Common.Interfaces;
using Logistik.Application.Features.Auth.DTOs;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Auth.Commands;

public record RefreshTokenCommand(string RefreshToken) : IRequest<AuthResponse>;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponse>
{
    private readonly IUnitOfWork _uow;
    private readonly IJwtService _jwt;

    public RefreshTokenCommandHandler(IUnitOfWork uow, IJwtService jwt)
    {
        _uow = uow;
        _jwt = jwt;
    }

    public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken ct)
    {
        var hashed = _jwt.HashRefreshToken(request.RefreshToken);
        var user = await _uow.Users.GetByRefreshTokenAsync(hashed, ct)
            ?? throw new DomainException("Invalid refresh token.");

        if (user.RefreshTokenExpiry < DateTime.UtcNow)
            throw new DomainException("Refresh token expired.");

        if (!user.IsActive)
            throw new DomainException("Account is deactivated.");

        var companyIds = user.CompanyPermissions.Select(p => p.CompanyId).ToList();
        var newAccessToken = _jwt.GenerateAccessToken(user, companyIds);
        var newRefreshToken = _jwt.GenerateRefreshToken();

        user.RefreshToken = _jwt.HashRefreshToken(newRefreshToken);
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync(ct);

        var permissions = user.CompanyPermissions.Select(p => new CompanyPermissionDto(
            p.CompanyId, p.Company?.Name ?? string.Empty, p.CanView, p.CanEdit, p.CanExport
        )).ToList();

        var userDto = new CurrentUserDto(
            user.Id, user.Username, user.Email,
            user.FirstName, user.LastName, user.Role.Name,
            companyIds, permissions);

        return new AuthResponse(newAccessToken, newRefreshToken, 900, userDto);
    }
}
