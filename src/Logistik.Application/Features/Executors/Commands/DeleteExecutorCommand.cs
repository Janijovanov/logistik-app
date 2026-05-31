using Logistik.Application.Common.Models;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Executors.Commands;

public record DeleteExecutorCommand(int Id) : IRequest<Result>;

public class DeleteExecutorCommandHandler : IRequestHandler<DeleteExecutorCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public DeleteExecutorCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(DeleteExecutorCommand request, CancellationToken ct)
    {
        var executor = await _uow.Executors.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException("Executor", request.Id);

        _uow.Executors.Remove(executor);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
