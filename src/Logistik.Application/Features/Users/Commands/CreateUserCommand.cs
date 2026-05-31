using Logistik.Application.Common.Interfaces;
using Logistik.Application.Common.Models;
using Logistik.Domain.Entities;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Users.Commands;

public record CreateUserCommand(string Username, string Email, string Password, string FirstName, string LastName, int RoleId) : IRequest<Result<int>>;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Result<int>>
{
    private readonly IUnitOfWork _uow;

    public CreateUserCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result<int>> Handle(CreateUserCommand request, CancellationToken ct)
    {
        var existingByUsername = await _uow.Users.GetByUsernameAsync(request.Username, ct);
        if (existingByUsername is not null)
            return Result<int>.Failure("Username already taken.");

        var existingByEmail = await _uow.Users.GetByEmailAsync(request.Email, ct);
        if (existingByEmail is not null)
            return Result<int>.Failure("Email already in use.");

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, 12),
            FirstName = request.FirstName,
            LastName = request.LastName,
            RoleId = request.RoleId
        };

        await _uow.Users.AddAsync(user, ct);
        await _uow.SaveChangesAsync(ct);

        return Result<int>.Success(user.Id);
    }
}
