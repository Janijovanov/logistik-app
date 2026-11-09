using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class ExpenseCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }
    /// <summary>0 = main expenses (shown on both pages), 1 = private-only.</summary>
    public int Scope { get; set; }
    public ICollection<ExpenseSubcategory> Subcategories { get; set; } = new List<ExpenseSubcategory>();
}
