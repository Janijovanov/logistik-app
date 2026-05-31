using Logistik.Domain.Entities;

namespace Logistik.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user, IEnumerable<int> companyIds);
    string GenerateRefreshToken();
    string HashRefreshToken(string token);
    int? GetUserIdFromExpiredToken(string token);
}
