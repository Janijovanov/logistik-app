using Logistik.Application.Common.Models;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Users.Commands;

public record UpdateUserCommand(int Id, string Email, string FirstName, string LastName, int RoleId, bool IsActive) : IRequest<Result>;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public UpdateUserCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(UpdateUserCommand request, CancellationToken ct)
    {
        var user = await _uow.Users.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException("User", request.Id);

        var emailTaken = await _uow.Users.GetByEmailAsync(request.Email, ct);
        if (emailTaken is not null && emailTaken.Id != request.Id)
            return Result.Failure("Email already in use.");

        user.Email = request.Email;
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.RoleId = request.RoleId;
        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        _uow.Users.Update(user);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
