using Logistik.Application.Common.Models;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Executors.Commands;

public record UpdateExecutorCommand(int Id, string Name, string Email, string BankAccount) : IRequest<Result>;

public class UpdateExecutorCommandHandler : IRequestHandler<UpdateExecutorCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public UpdateExecutorCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(UpdateExecutorCommand request, CancellationToken ct)
    {
        var executor = await _uow.Executors.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException("Executor", request.Id);

        executor.Name = request.Name;
        executor.Email = request.Email;
        executor.BankAccount = request.BankAccount;
        executor.UpdatedAt = DateTime.UtcNow;

        _uow.Executors.Update(executor);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
