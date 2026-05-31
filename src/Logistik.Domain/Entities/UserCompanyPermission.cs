using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class UserCompanyPermission : BaseEntity
{
    public int UserId { get; set; }
    public int CompanyId { get; set; }
    public bool CanView { get; set; } = true;
    public bool CanEdit { get; set; }
    public bool CanExport { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public int AssignedByUserId { get; set; }

    public User User { get; set; } = null!;
    public Company Company { get; set; } = null!;
    public User AssignedBy { get; set; } = null!;
}
