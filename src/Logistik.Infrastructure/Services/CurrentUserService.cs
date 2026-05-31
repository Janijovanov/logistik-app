using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Logistik.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Logistik.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        => _httpContextAccessor = httpContextAccessor;

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public int UserId => int.TryParse(
        User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
        ?? User?.FindFirst(ClaimTypes.NameIdentifier)?.Value,
        out var id) ? id : 0;
    public string Username => User?.FindFirst(JwtRegisteredClaimNames.Email)?.Value ?? string.Empty;
    public string Role => User?.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
    public bool IsAdmin => Role.Equals("Admin", StringComparison.OrdinalIgnoreCase);

    public IReadOnlyList<int> AssignedCompanyIds
    {
        get
        {
            var companiesClaim = User?.FindFirst("companies")?.Value;
            if (string.IsNullOrWhiteSpace(companiesClaim)) return Array.Empty<int>();
            return companiesClaim.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => int.TryParse(s, out var id) ? id : 0)
                .Where(id => id > 0).ToList();
        }
    }

    public bool HasCompanyAccess(int companyId) => IsAdmin || AssignedCompanyIds.Contains(companyId);
}
