using Logistik.Application.Common.Models;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Users.Commands;

public record DeleteUserCommand(int Id) : IRequest<Result>;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public DeleteUserCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(DeleteUserCommand request, CancellationToken ct)
    {
        var user = await _uow.Users.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException("User", request.Id);

        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
