using Logistik.Domain.Entities;
using Logistik.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Logistik.Infrastructure.Persistence.Repositories;

public class ExecutorRepository : BaseRepository<Executor>, IExecutorRepository
{
    public ExecutorRepository(AppDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Executor>> GetAllOrderedAsync(CancellationToken ct = default)
        => await _dbSet.OrderBy(e => e.Name).ToListAsync(ct);
}
