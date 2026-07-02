using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class WorkDocumentType : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<WorkTimeEntry> Entries { get; set; } = new List<WorkTimeEntry>();
}
