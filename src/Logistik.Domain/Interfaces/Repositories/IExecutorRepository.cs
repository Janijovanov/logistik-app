using Logistik.Domain.Entities;

namespace Logistik.Domain.Interfaces.Repositories;

public interface IExecutorRepository : IRepository<Executor>
{
    Task<IReadOnlyList<Executor>> GetAllOrderedAsync(CancellationToken ct = default);
}
