using Logistik.Domain.Entities;

namespace Logistik.Domain.Interfaces.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByUsernameAsync(string username, CancellationToken ct = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<User?> GetByRefreshTokenAsync(string hashedToken, CancellationToken ct = default);
    Task<User?> GetWithPermissionsAsync(int id, CancellationToken ct = default);
    Task<(IReadOnlyList<User> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search, bool? isActive = null, CancellationToken ct = default);
}
