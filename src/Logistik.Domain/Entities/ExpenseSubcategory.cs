using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class ExpenseSubcategory : BaseEntity
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }
    public decimal AnnualPlan { get; set; }
    public ExpenseCategory Category { get; set; } = null!;
    public ICollection<ExpenseEntry> Entries { get; set; } = new List<ExpenseEntry>();
}
