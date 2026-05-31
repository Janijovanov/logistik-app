using Logistik.Application.Features.Executors.DTOs;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Executors.Queries;

public record GetAllExecutorsQuery : IRequest<IReadOnlyList<ExecutorDto>>;

public class GetAllExecutorsQueryHandler : IRequestHandler<GetAllExecutorsQuery, IReadOnlyList<ExecutorDto>>
{
    private readonly IUnitOfWork _uow;

    public GetAllExecutorsQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IReadOnlyList<ExecutorDto>> Handle(GetAllExecutorsQuery request, CancellationToken ct)
    {
        var executors = await _uow.Executors.GetAllOrderedAsync(ct);
        return executors.Select(e => new ExecutorDto(e.Id, e.Name, e.Email, e.BankAccount)).ToList();
    }
}
