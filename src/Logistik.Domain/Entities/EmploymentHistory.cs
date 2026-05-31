using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class EmploymentHistory : BaseEntity
{
    public int EmployeeId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Employee Employee { get; set; } = null!;
}
