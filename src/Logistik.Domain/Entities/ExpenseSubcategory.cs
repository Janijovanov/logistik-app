using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class ExpenseSubcategory : BaseEntity
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }
    public decimal AnnualPlan { get; set; }
    /// <summary>0 = main-page subcategory, 1 = private-page subcategory. Lets each
    /// page keep its own lines (and amounts/plan) under a shared category header.</summary>
    public int Scope { get; set; }
    public ExpenseCategory Category { get; set; } = null!;
    public ICollection<ExpenseEntry> Entries { get; set; } = new List<ExpenseEntry>();
}
