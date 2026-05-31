namespace Logistik.Application.Common.Interfaces;

public interface ICurrentUserService
{
    int UserId { get; }
    string Username { get; }
    string Role { get; }
    bool IsAdmin { get; }
    IReadOnlyList<int> AssignedCompanyIds { get; }
    bool HasCompanyAccess(int companyId);
}
