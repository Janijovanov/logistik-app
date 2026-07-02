using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class WorkTimeCompany : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public ICollection<WorkTimeEntry> Entries { get; set; } = new List<WorkTimeEntry>();
}
