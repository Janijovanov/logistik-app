using Logistik.Domain.Entities;
using Logistik.Domain.Interfaces.Repositories;

namespace Logistik.Infrastructure.Persistence.Repositories;

public class EmploymentHistoryRepository : BaseRepository<EmploymentHistory>, IEmploymentHistoryRepository
{
    public EmploymentHistoryRepository(AppDbContext context) : base(context) { }
}
