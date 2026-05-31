using Logistik.Domain.Entities;
using Logistik.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Logistik.Infrastructure.Persistence.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }

    public async Task<User?> GetByUsernameAsync(string username, CancellationToken ct = default)
        => await _dbSet.Include(u => u.Role).Include(u => u.CompanyPermissions)
            .FirstOrDefaultAsync(u => u.Username == username, ct);

    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
        => await _dbSet.FirstOrDefaultAsync(u => u.Email == email, ct);

    public async Task<User?> GetByRefreshTokenAsync(string hashedToken, CancellationToken ct = default)
        => await _dbSet.Include(u => u.Role).Include(u => u.CompanyPermissions)
            .FirstOrDefaultAsync(u => u.RefreshToken == hashedToken, ct);

    public async Task<User?> GetWithPermissionsAsync(int id, CancellationToken ct = default)
        => await _dbSet.Include(u => u.Role)
            .Include(u => u.CompanyPermissions).ThenInclude(p => p.Company)
            .FirstOrDefaultAsync(u => u.Id == id, ct);

    public async Task<(IReadOnlyList<User> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search, CancellationToken ct = default)
    {
        var query = _dbSet.Include(u => u.Role).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(u => u.Username.Contains(search) || u.Email.Contains(search) || u.FirstName.Contains(search) || u.LastName.Contains(search));

        var total = await query.CountAsync(ct);
        var items = await query.OrderBy(u => u.Username).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return ((IReadOnlyList<User>)items, total);
    }
}
