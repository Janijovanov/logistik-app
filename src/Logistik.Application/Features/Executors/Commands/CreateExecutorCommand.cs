using Logistik.Application.Common.Models;
using Logistik.Domain.Entities;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Executors.Commands;

public record CreateExecutorCommand(string Name, string Email, string BankAccount) : IRequest<Result<int>>;

public class CreateExecutorCommandHandler : IRequestHandler<CreateExecutorCommand, Result<int>>
{
    private readonly IUnitOfWork _uow;

    public CreateExecutorCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result<int>> Handle(CreateExecutorCommand request, CancellationToken ct)
    {
        var executor = new Executor
        {
            Name = request.Name,
            Email = request.Email,
            BankAccount = request.BankAccount
        };

        await _uow.Executors.AddAsync(executor, ct);
        await _uow.SaveChangesAsync(ct);
        return Result<int>.Success(executor.Id);
    }
}
