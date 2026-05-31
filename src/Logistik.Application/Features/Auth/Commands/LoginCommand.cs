using Logistik.Application.Common.Interfaces;
using Logistik.Application.Features.Auth.DTOs;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Auth.Commands;

public record LoginCommand(string Username, string Password) : IRequest<AuthResponse>;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IUnitOfWork _uow;
    private readonly IJwtService _jwt;

    public LoginCommandHandler(IUnitOfWork uow, IJwtService jwt)
    {
        _uow = uow;
        _jwt = jwt;
    }

    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken ct)
    {
        var user = await _uow.Users.GetByUsernameAsync(request.Username, ct)
            ?? throw new DomainException("Invalid credentials.");

        if (!user.IsActive)
            throw new DomainException("Account is deactivated.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new DomainException("Invalid credentials.");

        var companyIds = user.CompanyPermissions.Select(p => p.CompanyId).ToList();
        var accessToken = _jwt.GenerateAccessToken(user, companyIds);
        var refreshToken = _jwt.GenerateRefreshToken();

        user.RefreshToken = _jwt.HashRefreshToken(refreshToken);
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

        return new AuthResponse(accessToken, refreshToken, 900, userDto);
    }
}
