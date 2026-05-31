namespace Logistik.Application.Features.Auth.DTOs;

public record LoginRequest(string Username, string Password);

public record RefreshTokenRequest(string RefreshToken);

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    int ExpiresIn,
    CurrentUserDto User);

public record CurrentUserDto(
    int Id,
    string Username,
    string Email,
    string FirstName,
    string LastName,
    string Role,
    IReadOnlyList<int> AssignedCompanyIds,
    IReadOnlyList<CompanyPermissionDto> Permissions);

public record CompanyPermissionDto(int CompanyId, string CompanyName, bool CanView, bool CanEdit, bool CanExport);

public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
