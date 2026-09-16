using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

/// <summary>Assigns a user (worker) to a work-time company. Many-to-many:
/// a worker can be assigned to several companies, a company to several workers.</summary>
public class WorkTimeCompanyWorker : BaseEntity
{
    public int WorkTimeCompanyId { get; set; }
    public WorkTimeCompany Company { get; set; } = null!;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
