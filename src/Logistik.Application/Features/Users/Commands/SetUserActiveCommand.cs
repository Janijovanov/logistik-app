using Logistik.Application.Common.Models;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Users.Commands;

public record SetUserActiveCommand(int Id, bool IsActive) : IRequest<Result>;

public class SetUserActiveCommandHandler : IRequestHandler<SetUserActiveCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public SetUserActiveCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(SetUserActiveCommand request, CancellationToken ct)
    {
        var user = await _uow.Users.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException("User", request.Id);

        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTime.UtcNow;
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
