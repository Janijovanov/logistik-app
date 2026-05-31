namespace Logistik.Application.Features.Users.DTOs;

public record UserDto(int Id, string Username, string Email, string FirstName, string LastName, string Role, bool IsActive, DateTime CreatedAt);

public record UserPermissionDto(int CompanyId, string CompanyName, bool CanView, bool CanEdit, bool CanExport);

public record UserDetailDto(int Id, string Username, string Email, string FirstName, string LastName, string Role, bool IsActive, DateTime CreatedAt, List<UserPermissionDto> Permissions);

public record CreateUserRequest(string Username, string Email, string Password, string FirstName, string LastName, int RoleId);

public record UpdateUserRequest(string Email, string FirstName, string LastName, int RoleId, bool IsActive);

public record AssignCompanyPermissionRequest(int CompanyId, bool CanView, bool CanEdit, bool CanExport);

public record UpdateCompanyPermissionRequest(bool CanView, bool CanEdit, bool CanExport);
