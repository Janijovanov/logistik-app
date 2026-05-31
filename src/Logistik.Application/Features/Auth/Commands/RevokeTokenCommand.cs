using Logistik.Application.Common.Interfaces;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Auth.Commands;

public record RevokeTokenCommand : IRequest;

public class RevokeTokenCommandHandler : IRequestHandler<RevokeTokenCommand>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public RevokeTokenCommandHandler(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    public async Task Handle(RevokeTokenCommand request, CancellationToken ct)
    {
        var user = await _uow.Users.GetByIdAsync(_currentUser.UserId, ct);
        if (user is null) return;

        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync(ct);
    }
}
