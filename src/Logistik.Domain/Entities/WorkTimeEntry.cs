using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class WorkTimeEntry : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int WorkTimeCompanyId { get; set; }
    public WorkTimeCompany Company { get; set; } = null!;
    public int WorkDocumentTypeId { get; set; }
    public WorkDocumentType DocumentType { get; set; } = null!;
    public DateOnly Date { get; set; }
    public int DocumentCount { get; set; }
    public int Minutes { get; set; }
    public string? Notes { get; set; }
}
