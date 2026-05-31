using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class Company : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string HeadquartersAddress { get; set; } = string.Empty;
    public string TaxNumber { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    public ICollection<UserCompanyPermission> UserPermissions { get; set; } = new List<UserCompanyPermission>();
}
